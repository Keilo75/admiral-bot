use exn::{OptionExt, Result, ResultExt};
use serenity::all::{
    CommandInteraction, Context, CreateInteractionResponse, CreateInteractionResponseMessage,
};

use crate::{embeds, error::SlashCommandError, state::State};

pub async fn run(
    ctx: &Context,
    interaction: &CommandInteraction,
    state: &State,
) -> Result<(), SlashCommandError> {
    let random_article = state
        .articles_repository
        .get_random()
        .await
        .ok_or_raise(|| SlashCommandError::new("failed to get random article"))?;

    interaction
        .create_response(
            &ctx.http,
            CreateInteractionResponse::Message(CreateInteractionResponseMessage::new().embed(
                embeds::create_article_embed(random_article.as_ref(), state.config.embed_color),
            )),
        )
        .await
        .or_raise(|| SlashCommandError::new("failed to create interaction response"))?;

    Ok(())
}
