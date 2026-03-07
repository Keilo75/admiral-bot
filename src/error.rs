use derive_more::Display;

#[derive(Debug, Display)]
pub(super) struct SlashCommandError(String);
impl std::error::Error for SlashCommandError {}

impl SlashCommandError {
    pub(super) fn new(message: impl Into<String>) -> Self {
        Self(message.into())
    }
}
