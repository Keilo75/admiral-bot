use clap::{Parser, Subcommand};
use derive_more::Display;
use exn::{Result, ResultExt};
use tracing::info;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

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
    RegisterDev { guild_id: String },
}

#[tokio::main]
async fn main() -> Result<(), FatalError> {
    dotenvy::dotenv().or_raise(|| FatalError("failed to load .env file".into()))?;

    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let args = Cli::parse();
    info!("{:?}", args);

    Ok(())
}

#[derive(Debug, Display)]
struct FatalError(String);
impl std::error::Error for FatalError {}
