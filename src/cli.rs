use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub(super) struct Args {
    #[command(subcommand)]
    pub(super) command: Commands,
    #[arg(long, env)]
    pub(super) discord_token: String,
}

#[derive(Subcommand, Debug)]
pub(super) enum Commands {
    /// Register commands for the provided guild
    RegisterDev { application_id: u64, guild_id: u64 },
    /// Start the Discord bot
    Start,
}
