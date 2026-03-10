use exn::{Result, ResultExt, bail};
use rust_i18n::t;
use serenity::all::{
    AutocompleteChoice, CommandInteraction, CommandOptionType, Context, CreateAutocompleteResponse,
    CreateEmbed, CreateInteractionResponse, CreateInteractionResponseMessage, ResolvedValue,
};

use crate::{error::SlashCommandError, i18n, state::State};

pub async fn run(
    ctx: &Context,
    interaction: &CommandInteraction,
    state: &State,
) -> Result<(), SlashCommandError> {
    let options = interaction.data.options();
    let Some(ResolvedValue::String(article_id)) = options.first().map(|option| &option.value)
    else {
        bail!(SlashCommandError::new("received unexpected options"))
    };

    let article = state.articles_repository.get_by_id(article_id);

    let message = match article {
        Some(article) => {
            let date = if article.dates.len() > 1 {
                t!("article.accident-dates")
            } else {
                t!("article.accident-date")
            };

            let location = if article.locations.len() > 1 {
                t!("article.locations")
            } else {
                t!("article.location")
            };

            let embed = CreateEmbed::new()
                .title(&article.title)
                .description(i18n::format_long_list(&article.identifiers))
                .color(state.config.embed_color)
                .field(t!("article.accident-type"), &article.accident_type, true)
                .field(date, i18n::format_short_list(&article.dates), true)
                .field("\u{200b}", "\u{200b}", true)
                .field(
                    t!("article.aircraft"),
                    i18n::format_short_list(&article.aircraft),
                    true,
                )
                .field(location, i18n::format_short_list(&article.locations), true)
                .field("\u{200b}", "\u{200b}", true)
                .field(
                    t!("article.links"),
                    t!(
                        "article.links-urls",
                        reddit = article.reddit,
                        medium = article.medium
                    ),
                    true,
                )
                .field(t!("article.release-date"), &article.release_date, true)
                .field("\u{200b}", "\u{200b}", true);

            CreateInteractionResponseMessage::new().embed(embed)
        }
        // TODO: Include query in output, markdown-escape it beforehand.
        None => CreateInteractionResponseMessage::new()
            .content(t!("article.not-found"))
            .ephemeral(true),
    };

    interaction
        .create_response(&ctx.http, CreateInteractionResponse::Message(message))
        .await
        .or_raise(|| SlashCommandError::new("failed to create interaction response"))?;

    Ok(())
}

pub async fn autocomplete(
    ctx: &Context,
    interaction: &CommandInteraction,
    state: &State,
) -> Result<(), SlashCommandError> {
    let options = interaction.data.options();
    let Some(ResolvedValue::Autocomplete {
        kind: CommandOptionType::String,
        value,
    }) = options.first().map(|option| &option.value)
    else {
        bail!(SlashCommandError::new("received unexpected options"))
    };

    let query = value.trim().to_lowercase();

    let choices = state
        .articles_repository
        .get_by_title_or_identifier(&query)
        .into_iter()
        .map(|article| {
            let title = &article.title;
            let identifiers = i18n::format_short_list(&article.identifiers);
            let name = t!("article.option", title = title, identifiers = identifiers);

            AutocompleteChoice::new(name, article.id.to_string())
        })
        .collect();

    interaction
        .create_response(
            &ctx.http,
            CreateInteractionResponse::Autocomplete(
                CreateAutocompleteResponse::new().set_choices(choices),
            ),
        )
        .await
        .or_raise(|| SlashCommandError::new("failed to create interaction response"))?;

    Ok(())
}
