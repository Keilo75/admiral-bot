use std::sync::Arc;

use crate::{
    commands::{SlashCommand, SlashCommands, about, article, random},
    error::SlashCommandError,
    state::State,
};
use derive_more::Display;
use exn::{Exn, ResultExt};
use rust_i18n::t;
use serenity::{
    all::{Context, EventHandler, Interaction, Ready},
    async_trait,
};
use tracing::info;

#[derive(Debug, Display)]
struct HandlerError(String);
impl std::error::Error for HandlerError {}

pub(super) struct Handler {
    slash_commands: SlashCommands,
    state: Arc<State>,
}

impl Handler {
    pub(super) fn new(slash_commands: SlashCommands, state: State) -> Self {
        Self {
            slash_commands,
            state: Arc::new(state),
        }
    }

    async fn refetch_task(state: Arc<State>, ctx: Context) {
        let mut interval = tokio::time::interval(state.config.refetch_interval);
        interval.tick().await;

        loop {
            interval.tick().await;

            let prev_count = state.articles_repository.count();

            let result = state
                .articles_repository
                .update_from_csv()
                .await
                .or_raise(|| HandlerError("failed to refetch articles".into()));

            match result {
                Ok(_) => {
                    state
                        .logger
                        .info(
                            &ctx.http,
                            t!(
                                "logs.refetched-articles",
                                count = state.articles_repository.count(),
                                prev_count = prev_count
                            ),
                        )
                        .await
                }
                Err(e) => state.logger.error(&ctx.http, e).await,
            };
        }
    }
}

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        let result = match interaction {
            Interaction::Command(interaction) => match self
                .slash_commands
                .get(&interaction.data.name)
            {
                Some(SlashCommand::About) => about::run(&ctx, &interaction, &self.state).await,
                Some(SlashCommand::Article) => article::run(&ctx, &interaction, &self.state).await,
                Some(SlashCommand::Random) => random::run(&ctx, &interaction, &self.state).await,
                None => Err(Exn::new(SlashCommandError::new(
                    "received unknown slash command",
                ))),
            }
            .or_raise(|| {
                HandlerError(format!(
                    "failed to run slash command '{}'",
                    &interaction.data.name
                ))
            }),
            Interaction::Autocomplete(interaction) => {
                match self.slash_commands.get(&interaction.data.name) {
                    Some(SlashCommand::Article) => {
                        article::autocomplete(&ctx, &interaction, &self.state).await
                    }
                    None | Some(SlashCommand::About | SlashCommand::Random) => Err(Exn::new(
                        SlashCommandError::new("received unknown autocomplete"),
                    )),
                }
                .or_raise(|| {
                    HandlerError(format!(
                        "failed to run autocomplete '{}'",
                        &interaction.data.name
                    ))
                })
            }
            _ => Err(Exn::new(HandlerError(
                "received unexpected interaction".into(),
            ))),
        };

        if let Err(err) = result {
            self.state.logger.error(&ctx.http, err).await;
        }
    }

    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Logged in as {}", &ready.user.name);

        self.state
            .logger
            .info(&ctx.http, t!("logs.logged-in", username = ready.user.name))
            .await;

        ctx.set_activity(None);

        tokio::spawn(Self::refetch_task(self.state.clone(), ctx));
    }
}
