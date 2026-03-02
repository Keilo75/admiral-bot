use crate::commands::Command;
use serenity::all::CreateCommand;

pub(super) struct About;

impl Command for About {
    fn register(&self) -> CreateCommand {
        CreateCommand::new("about").description("hello")
    }
}
