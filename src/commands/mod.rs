use serenity::all::CreateCommand;
use std::collections::HashMap;

pub(super) mod about;

pub(super) enum SlashCommand {
    About,
}

impl SlashCommand {
    fn name(&self) -> &str {
        match self {
            &SlashCommand::About => "about",
        }
    }

    fn to_create_command(&self) -> CreateCommand {
        let create_command = CreateCommand::new(self.name());

        match self {
            // TODO: use i18n for description(s)
            SlashCommand::About => create_command.description("Show information about the bot."),
        }
    }
}

pub(super) struct SlashCommands {
    commands: HashMap<String, SlashCommand>,
}

impl SlashCommands {
    pub(super) fn new() -> Self {
        let commands = vec![SlashCommand::About]
            .into_iter()
            .map(|command| (command.name().to_string(), command))
            .collect();

        Self { commands }
    }

    pub(super) fn to_create_commands(&self) -> Vec<CreateCommand> {
        self.commands
            .values()
            .map(|command| command.to_create_command())
            .collect()
    }

    pub(super) fn get(&self, name: &str) -> Option<&SlashCommand> {
        self.commands.get(name)
    }
}
