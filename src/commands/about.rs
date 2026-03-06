use rust_i18n::t;
use serenity::all::{
    CommandInteraction, Context, CreateEmbed, CreateEmbedFooter, CreateInteractionResponse,
    CreateInteractionResponseMessage,
};

use crate::state::State;

pub async fn run(ctx: Context, interaction: CommandInteraction, state: &State) -> () {
    let footer = CreateEmbedFooter::new(t!("about.footer"));
    let embed = CreateEmbed::new()
        .title(t!("about.title"))
        .description(t!("about.description"))
        .color(state.config.embed_color)
        .field(t!("about.links"), t!("about.links-urls"), false)
        .footer(footer);

    interaction
        .create_response(
            &ctx.http,
            CreateInteractionResponse::Message(
                CreateInteractionResponseMessage::new().embed(embed),
            ),
        )
        .await
        .unwrap();
}
