use exn::{Result, ResultExt, bail};
use rust_i18n::t;
use serenity::all::{
    AutocompleteChoice, CommandInteraction, CommandOptionType, Context, CreateAutocompleteResponse,
    CreateInteractionResponse, ResolvedValue,
};

use crate::{error::SlashCommandError, i18n, state::State};

pub async fn run(
    ctx: &Context,
    interaction: &CommandInteraction,
    state: &State,
) -> Result<(), SlashCommandError> {
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
