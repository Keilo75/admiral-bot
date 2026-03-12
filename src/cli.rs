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
    /// Register slash commands
    Register {
        /// Delete slash commands instead of registering them
        #[arg(long, action)]
        delete: bool,
        #[command(subcommand)]
        command: RegisterCommands,
    },
    /// Create and migrate the database
    MigrateDatabase,
    /// Start the Discord bot
    Start,
}

#[derive(Subcommand, Debug, Clone)]
pub(super) enum RegisterCommands {
    /// Register slash commands to a single guild
    Guild { application_id: u64, guild_id: u64 },
    /// Register slash commands globally
    Global { application_id: u64 },
}
