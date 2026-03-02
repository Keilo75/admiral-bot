use lazy_static::lazy_static;
use serenity::all::CreateCommand;

mod about;

pub(super) trait Command: Sync {
    fn register(&self) -> CreateCommand;
}

lazy_static! {
    pub(super) static ref COMMANDS: Vec<Box<dyn Command>> = vec![Box::new(about::About)];
}
