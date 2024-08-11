import { EmbedBuilder } from "discord.js";
import { t } from "i18next";

type ArticleLink = "reddit" | "medium";

export type FilteredArticle = {
  name: string;
  value: string;
};

export type Article = {
  id: string;
  title: string;
  releaseDate: string;
  links: Partial<Record<ArticleLink, string>>;
  accident: {
    type: string;
    identifiers: string[];
    dates: string[];
    aircraft: string[];
    locations: string[];
  };
};

export type PaginatedArticles = Article[][];

export type SearchableColumn =
  | "title"
  | "accident.identifiers"
  | "accident.type"
  | "accident.dates"
  | "accident.aircraft"
  | "accident.locations";

export const SEARCHABLE_COLUMNS = [
  { name: t("article.title"), value: "title" },
  { name: t("article.identifiers"), value: "accident.identifiers" },
  { name: t("article.accident-type"), value: "accident.type" },
  { name: t("article.accident-date", { count: 2 }), value: "accident.dates" },
  { name: t("article.aircraft", { count: 2 }), value: "accident.aircraft" },
  { name: t("article.location", { count: 2 }), value: "accident.locations" },
];

export const getArticleValueByColumn = (
  article: Article,
  column: SearchableColumn
): string => {
  const { title, accident } = article;
  const { type, identifiers, dates, aircraft, locations } = accident;

  switch (column) {
    case "title":
      return title;
    case "accident.type":
      return type;
    case "accident.identifiers":
      return identifiers.join();
    case "accident.dates":
      return dates.join();
    case "accident.aircraft":
      return aircraft.join();
    case "accident.locations":
      return locations.join();
  }
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
