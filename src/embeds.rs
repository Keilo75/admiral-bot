use rust_i18n::t;
use serenity::all::{Color, CreateEmbed};

use crate::{i18n, repositories::Article};

pub(super) fn create_article_embed(article: &Article, color: Color) -> CreateEmbed {
    let date = if article.dates.len() > 1 {
        t!("article.accident-dates")
    } else {
        t!("article.accident-date")
    };

    let location = if article.locations.len() > 1 {
        t!("article.locations")
    } else {
        t!("article.location")
    };

    CreateEmbed::new()
        .title(&article.title)
        .description(i18n::format_long_list(&article.identifiers))
        .color(color)
        .field(t!("article.accident-type"), &article.accident_type, true)
        .field(date, i18n::format_short_list(&article.dates), true)
        .field("\u{200b}", "\u{200b}", true)
        .field(
            t!("article.aircraft"),
            i18n::format_short_list(&article.aircraft),
            true,
        )
        .field(location, i18n::format_short_list(&article.locations), true)
        .field("\u{200b}", "\u{200b}", true)
        .field(
            t!("article.links"),
            t!(
                "article.links-urls",
                reddit = article.reddit,
                medium = article.medium
            ),
            true,
        )
        .field(t!("article.release-date"), &article.release_date, true)
        .field("\u{200b}", "\u{200b}", true)
}
