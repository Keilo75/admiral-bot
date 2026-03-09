mod config;
pub(super) use config::Config;

mod logger;
pub(super) use logger::Logger;

use crate::repositories::ArticlesRepository;

pub(super) struct State {
    pub(super) config: Config,
    pub(super) logger: Logger,
    pub(super) articles_repository: ArticlesRepository,
}

impl State {
    pub(super) fn new(config: Config, articles_repository: ArticlesRepository) -> Self {
        Self {
            logger: Logger::new(config.log_channel_id, config.log_user_id),
            config,
            articles_repository,
        }
    }
}
