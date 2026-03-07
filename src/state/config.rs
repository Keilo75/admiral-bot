use derive_more::Display;
use serenity::all::{ChannelId, Color, UserId};

use crate::cli::Args;

pub struct Config {
    pub embed_color: Color,
    pub log_channel_id: ChannelId,
    pub log_user_id: UserId,
}

#[derive(Debug, Display)]
pub enum ConfigError {
    #[display("embed color must be of format '#rrggbb'")]
    EmbedColor,
}
impl std::error::Error for ConfigError {}

impl Config {
    pub fn try_from_args(args: &Args) -> Result<Self, ConfigError> {
        let embed_color =
            Self::parse_embed_color(&args.embed_color).ok_or(ConfigError::EmbedColor)?;

        Ok(Self {
            embed_color,
            log_channel_id: args.log_channel_id.into(),
            log_user_id: args.log_user_id.into(),
        })
    }

    fn parse_embed_color(embed_color: &str) -> Option<Color> {
        if embed_color.len() != 7 || !embed_color.starts_with("#") {
            return None;
        }

        let hex = &embed_color[1..];
        if !hex.chars().all(|char| char.is_ascii_hexdigit()) {
            return None;
        }

        let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
        let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
        let b = u8::from_str_radix(&hex[4..6], 16).ok()?;

        Some(Color::from_rgb(r, g, b))
    }
}
