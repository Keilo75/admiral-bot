use std::str::FromStr;

use clap::Parser;
use derive_more::Display;
use exn::{Result, ResultExt};
use rust_i18n::i18n;
use serenity::{
    Client,
    all::{GatewayIntents, Http},
};
use sqlx::{ConnectOptions, sqlite::SqliteConnectOptions};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod cli;
mod commands;
mod error;
mod handler;
mod i18n;
mod repositories;
mod state;

i18n!("assets/locale", fallback = "en-US");

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

        cli::Commands::MigrateDatabase => {
            let sqlite_options = SqliteConnectOptions::from_str(&args.database_url)
                .or_raise(|| FatalError("failed to parse database url".into()))?
                .create_if_missing(true);

            let mut connection = sqlite_options
                .connect()
                .await
                .or_raise(|| FatalError("failed to connect to database".into()))?;

            sqlx::migrate!("./migrations")
                .run(&mut connection)
                .await
                .or_raise(|| FatalError("failed to migrate database".into()))?;
        }

        cli::Commands::Start => {
            let config = state::Config::try_from_args(&args)
                .or_raise(|| FatalError("failed to parse config".into()))?;

            let articles_repository =
                repositories::ArticlesRepository::initialize(args.articles_csv_url.clone())
                    .await
                    .or_raise(|| FatalError("failed to initialize articles repository".into()))?;

            let state = state::State::new(config, articles_repository);

            let mut client = Client::builder(&args.discord_token, GatewayIntents::empty())
                .event_handler(handler::Handler::new(slash_commands, state))
                .await
                .or_raise(|| FatalError("failed to create client".into()))?;

            client
                .start()
                .await
                .or_raise(|| FatalError("failed to start client".into()))?;

            // TODO: periodically refetch articles
        }
    }

    Ok(())
}

#[derive(Debug, Display)]
struct FatalError(String);
impl std::error::Error for FatalError {}
