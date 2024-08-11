import { EmbedBuilder } from "discord.js";
import { t } from "i18next";

import { type Article } from "./article";

const EMBED_COLOR = "#C6A6C2";

const createMarkdownLinks = (links: Article["links"]) =>
  Object.entries(links).map(
    ([site, link]) => `[${t(`links.${site}`)}](${link})`
  );
export const buildArticleEmbed = (article: Article): EmbedBuilder => {
  const { accident, links } = article;

  const markdownLinks = createMarkdownLinks(links);

  return new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(article.title)
    .setDescription(t("format.list-long", { values: accident.identifiers }))
    .addFields(
      { name: t("article.accident-type"), value: accident.type },
      {
        name: t("article.accident-date", { count: accident.dates.length }),
        value: t("format.list-short", { values: accident.dates }),
      },
      {
        name: t("article.aircraft", { count: accident.aircraft.length }),
        value: t("format.list-short", { values: accident.aircraft }),
      },
      {
        name: t("article.location", { count: accident.locations.length }),
        value: t("format.list-short", { values: accident.locations }),
      },
      {
        name: t("article.link", { count: markdownLinks.length }),
        value: markdownLinks.join("\n"),
        inline: true,
      },
      {
        name: t("article.release-date"),
        value: article.releaseDate,
        inline: true,
      }
    );
};

export const buildSearchResultEmbed = (articles: Article[]): EmbedBuilder => {
  return new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(t("search.results"))
    .addFields(
      articles.map(({ title, links, accident }) => ({
        name: title,
        value: t("search.item", {
          identifiers: accident.identifiers,
          links: createMarkdownLinks(links),
        }),
      }))
    );
};
