use clap::{Parser, Subcommand};
use derive_more::Display;
use exn::{Result, ResultExt};
use serenity::all::{CreateCommand, Http};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod commands;
use commands::COMMANDS;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
    #[arg(long, env)]
    discord_token: String,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Register commands for the provided guild
    RegisterDev { application_id: u64, guild_id: u64 },
}

#[tokio::main]
async fn main() -> Result<(), FatalError> {
    dotenvy::dotenv().or_raise(|| FatalError("failed to load .env file".into()))?;

    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let args = Cli::parse();

    match args.command {
        Commands::RegisterDev {
            application_id,
            guild_id,
        } => {
            let http = Http::new(&args.discord_token);
            http.set_application_id(application_id.into());

            let commands: Vec<CreateCommand> =
                COMMANDS.iter().map(|command| command.register()).collect();

            http.create_guild_commands(guild_id.into(), &commands)
                .await
                .or_raise(|| FatalError("failed to create guild commands".into()))?;
        }
    }

    Ok(())
}

#[derive(Debug, Display)]
struct FatalError(String);
impl std::error::Error for FatalError {}
