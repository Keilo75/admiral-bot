use serenity::all::{ChannelId, CreateMessage, Http, UserId};

pub struct Logger {
    _log_user_id: UserId,
    log_channel_id: ChannelId,
}

impl Logger {
    pub fn new(log_channel_id: ChannelId, log_user_id: UserId) -> Self {
        Self {
            log_channel_id,
            _log_user_id: log_user_id,
        }
    }

    pub async fn info(&self, http: &Http, message: impl Into<String>) {
        let message = CreateMessage::new().content(message);
        self.log_channel_id
            .send_message(&http, message)
            .await
            .unwrap();
    }
}
