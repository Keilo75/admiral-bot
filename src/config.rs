use derive_more::Display;
use serenity::all::Color;

use crate::cli::Args;

pub(super) struct Config {
    pub(super) embed_color: Color,
}

#[derive(Debug, Display)]
pub(super) enum ConfigError {
    #[display("embed color must be of format '#rrggbb'")]
    EmbedColor,
}
impl std::error::Error for ConfigError {}

impl Config {
    pub(super) fn try_from_args(args: &Args) -> Result<Self, ConfigError> {
        let embed_color =
            Self::parse_embed_color(&args.embed_color).ok_or(ConfigError::EmbedColor)?;

        Ok(Self { embed_color })
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
