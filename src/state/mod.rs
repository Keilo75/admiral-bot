mod config;
pub(super) use config::Config;

mod logger;
pub(super) use logger::Logger;

pub(super) struct State {
    pub(super) config: Config,
    pub(super) logger: Logger,
}

impl State {
    pub(super) fn new(config: Config) -> Self {
        Self {
            logger: Logger::new(config.log_channel_id, config.log_user_id),
            config,
        }
    }
}
