use std::borrow::Cow;

use exn::Exn;
use rust_i18n::t;
use serenity::all::{ChannelId, CreateMessage, Http, UserId};
use tracing::error;

pub struct Logger {
    log_user_id: UserId,
    log_channel_id: ChannelId,
}

impl Logger {
    pub fn new(log_channel_id: ChannelId, log_user_id: UserId) -> Self {
        Self {
            log_channel_id,
            log_user_id: log_user_id,
        }
    }

    pub async fn info(&self, http: &Http, message: Cow<'_, str>) {
        let message = CreateMessage::new().content(t!("logs.info", message = message));

        if let Err(err) = self.log_channel_id.send_message(&http, message).await {
            error!("Failed to log info message: {:?}", err)
        }
    }

    pub async fn error<E: std::error::Error + Send + Sync>(&self, http: &Http, error: Exn<E>) {
        let message = CreateMessage::new().content(t!(
            "logs.error",
            error = format!("{:?}", error),
            user_id = self.log_user_id
        ));

        if let Err(err) = self.log_channel_id.send_message(&http, message).await {
            error!("Failed to log error message: {:?}", err)
        }
    }
}
