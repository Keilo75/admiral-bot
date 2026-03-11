use exn::{Result, ResultExt, bail};
use rust_i18n::t;
use serenity::all::{
    AutocompleteChoice, CommandInteraction, CommandOptionType, Context, CreateAutocompleteResponse,
    CreateInteractionResponse, CreateInteractionResponseMessage, ResolvedValue,
};

use crate::{embeds, error::SlashCommandError, i18n, state::State};

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
        Some(article) => CreateInteractionResponseMessage::new().embed(
            embeds::create_article_embed(article.as_ref(), state.config.embed_color),
        ),
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
