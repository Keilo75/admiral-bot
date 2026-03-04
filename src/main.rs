use clap::Parser;
use derive_more::Display;
use exn::{Result, ResultExt};
use serenity::{
    Client,
    all::{GatewayIntents, Http},
};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod cli;
mod commands;
mod handler;

#[tokio::main]
async fn main() -> Result<(), FatalError> {
    dotenvy::dotenv().or_raise(|| FatalError("failed to load .env file".into()))?;

    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let args = cli::Args::parse();

    let slash_commands = commands::SlashCommands::new();
    match args.command {
        cli::Commands::RegisterDev {
            application_id,
            guild_id,
        } => {
            let http = Http::new(&args.discord_token);
            http.set_application_id(application_id.into());

            http.create_guild_commands(guild_id.into(), &slash_commands.to_create_commands())
                .await
                .or_raise(|| FatalError("failed to create guild commands".into()))?;
        }

        cli::Commands::Start => {
            let mut client = Client::builder(&args.discord_token, GatewayIntents::empty())
                .event_handler(handler::Handler::new(slash_commands))
                .await
                .or_raise(|| FatalError("failed to create client".into()))?;

            client
                .start()
                .await
                .or_raise(|| FatalError("failed to start client".into()))?;
        }
    }

    Ok(())
}

#[derive(Debug, Display)]
struct FatalError(String);
impl std::error::Error for FatalError {}
