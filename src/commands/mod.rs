use rust_i18n::t;
use serenity::all::{CommandOptionType, CreateCommand, CreateCommandOption};
use std::collections::HashMap;

pub(super) mod about;
pub(super) mod article;

#[derive(Copy, Clone)]
pub(super) enum SlashCommand {
    About,
    Article,
}

impl SlashCommand {
    pub(super) fn name(&self) -> &str {
        match self {
            SlashCommand::About => "about",
            SlashCommand::Article => "article",
        }
    }

    fn to_create_command(&self) -> CreateCommand {
        let create_command = CreateCommand::new(self.name())
            .description(t!(format!("command-descriptions.{}", self.name())));

        match self {
            SlashCommand::About => create_command,
            SlashCommand::Article => create_command.add_option(
                CreateCommandOption::new(
                    CommandOptionType::String,
                    t!("article.query"),
                    t!("article.query-description"),
                )
                .required(true)
                .max_length(100)
                .set_autocomplete(true),
            ),
        }
    }
}

pub(super) struct SlashCommands {
    commands: HashMap<String, SlashCommand>,
}

impl SlashCommands {
    pub(super) fn new() -> Self {
        let commands = vec![SlashCommand::About, SlashCommand::Article]
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

    pub(super) fn get(&self, name: &str) -> Option<SlashCommand> {
        self.commands.get(name).copied()
    }
}
