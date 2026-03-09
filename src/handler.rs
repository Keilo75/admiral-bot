use crate::{
    commands::{SlashCommand, SlashCommands, about, article},
    state::State,
};
use derive_more::Display;
use exn::ResultExt;
use rust_i18n::t;
use serenity::{
    all::{CommandInteraction, Context, EventHandler, Interaction, Ready},
    async_trait,
};
use tracing::info;

#[derive(Debug, Display)]
#[display("failed to run slash command '{command_name}'")]
struct RunSlashCommandError {
    command_name: String,
}
impl std::error::Error for RunSlashCommandError {}

pub(super) struct Handler {
    slash_commands: SlashCommands,
    state: State,
}

impl Handler {
    pub(super) fn new(slash_commands: SlashCommands, state: State) -> Self {
        Self {
            slash_commands,
            state,
        }
    }

    async fn run_slash_command(
        &self,
        command: &SlashCommand,
        ctx: Context,
        interaction: CommandInteraction,
    ) {
        let result = match command {
            SlashCommand::About => about::run(&ctx, &interaction, &self.state).await,
            SlashCommand::Article => article::run(&ctx, &interaction, &self.state).await,
        }
        .or_raise(|| RunSlashCommandError {
            command_name: command.name().to_string(),
        });

        if let Err(err) = result {
            self.state.logger.error(&ctx.http, err).await;
        }
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

    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Logged in as {}", &ready.user.name);

        self.state
            .logger
            .info(&ctx.http, t!("logs.logged-in", username = ready.user.name))
            .await;
    }
}
