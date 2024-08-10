import { EmbedBuilder } from "discord.js";
import { t } from "i18next";

type ArticleLink = "reddit" | "medium";

export const EMPTY_FIELD = { name: "\u200b", value: "\u200b", inline: true };

export type Article = {
  id: string;
  title: string;
  releaseDate: Date;
  links: Partial<Record<ArticleLink, string>>;
  accident: {
    type: string;
    identifiers: string[];
    dates: Date[];
    aircraft: string[];
    locations: string[];
  };
};

export const buildArticleEmbed = (article: Article): EmbedBuilder => {
  const { accident } = article;

  const markdownLinks = Object.entries(article.links).map(
    ([site, link]) => `[${t(`links.${site}`)}](${link})`
  );

  return new EmbedBuilder()
    .setColor("#C6A6C2")
    .setTitle(article.title)
    .setDescription(t("format.list-long", { values: accident.identifiers }))
    .addFields(
      { name: t("article.accident-type"), value: accident.type, inline: true },
      {
        name: t("article.accident-date", { count: accident.dates.length }),
        value: t("format.dates", { dates: accident.dates }),
        inline: true,
      },
      EMPTY_FIELD,
      {
        name: t("article.aircraft", { count: accident.aircraft.length }),
        value: t("format.list-short", { values: accident.aircraft }),
        inline: true,
      },
      {
        name: t("article.location", { count: accident.locations.length }),
        value: t("format.list-short", { values: accident.locations }),
        inline: true,
      },
      EMPTY_FIELD,
      {
        name: t("article.link", { count: markdownLinks.length }),
        value: markdownLinks.join("\n"),
        inline: true,
      },
      {
        name: t("article.release-date"),
        value: t("format.dates", { dates: [article.releaseDate] }),
        inline: true,
      },
      EMPTY_FIELD
    );
};
