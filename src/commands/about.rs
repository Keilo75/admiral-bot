use serenity::all::{
    Color, CommandInteraction, Context, CreateEmbed, CreateEmbedFooter, CreateInteractionResponse,
    CreateInteractionResponseMessage,
};

pub async fn run(ctx: Context, interaction: CommandInteraction) -> () {
    let links = "[Data Source](https://docs.google.com/spreadsheets/d/1KZ9MQcOUI0ecnYUp_tqPUTSvZvhDRH8K-tcl7HwF3PU/edit?usp=sharing)\n[GitHub](https://github.com/Keilo75/admiral-bot)";

    let footer = CreateEmbedFooter::new("Made by Keilo75");
    let embed = CreateEmbed::new()
        .title("About")
        .description("This is a description")
        // TODO: create state to hold config
        .color(Color::from_rgb(198, 166, 194))
        .field("Links", links, false)
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
