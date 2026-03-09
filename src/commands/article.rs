use exn::{Result, ResultExt, bail};
use serenity::all::{
    AutocompleteChoice, CommandInteraction, CommandOptionType, Context, CreateAutocompleteResponse,
    CreateInteractionResponse, ResolvedValue,
};

use crate::{error::SlashCommandError, state::State};

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

    // TODO: construct name dynamically
    let choices = state
        .articles_repository
        .get_by_title_or_identifier(&query)
        .into_iter()
        .map(|article| AutocompleteChoice::new(&article.title, article.id.to_string()))
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
