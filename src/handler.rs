use serenity::{
    all::{CommandInteraction, Context, EventHandler, Interaction, Ready},
    async_trait,
};
use tracing::info;

use crate::commands::{SlashCommand, SlashCommands, about};

pub(super) struct Handler {
    slash_commands: SlashCommands,
}

impl Handler {
    pub(super) fn new(slash_commands: SlashCommands) -> Self {
        Self { slash_commands }
    }

    // TODO: make this fallible
    async fn run_slash_command(
        &self,
        command: &SlashCommand,
        ctx: Context,
        interaction: CommandInteraction,
    ) {
        match command {
            SlashCommand::About => about::run(ctx, interaction).await,
        };
    }
}

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::Command(interaction) = interaction
            && let Some(command) = self.slash_commands.get(&interaction.data.name)
        {
            self.run_slash_command(command, ctx, interaction).await;
        }
    }

    async fn ready(&self, _: Context, ready: Ready) {
        info!("Logged in as '{}'.", ready.user.name);
    }
}
