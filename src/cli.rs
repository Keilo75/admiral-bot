use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub(super) struct Args {
    #[command(subcommand)]
    pub(super) command: Commands,
    #[arg(long, env)]
    pub(super) discord_token: String,
    #[arg(long, env)]
    pub(super) embed_color: String,
    #[arg(long, env)]
    pub(super) log_channel_id: u64,
    #[arg(long, env)]
    pub(super) log_user_id: u64,
    #[arg(long, env)]
    pub(super) database_url: String,
    #[arg(long, env)]
    pub(super) articles_csv_url: String,
    #[arg(long, env)]
    pub(super) refetch_interval_minutes: u64,
}

#[derive(Subcommand, Debug)]
pub(super) enum Commands {
    /// Register commands for the provided guild
    RegisterDev { application_id: u64, guild_id: u64 },
    /// Create and migrate the database
    MigrateDatabase,
    /// Start the Discord bot
    Start,
}
