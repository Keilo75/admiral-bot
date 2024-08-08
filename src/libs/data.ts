import { parseString } from "@fast-csv/parse";

import { Article } from "../models/article";
import { Logger } from "../utils";

export const fetchArticles = async (): Promise<Article[]> => {
  Logger.info("Fetching articels.");

  const response = await fetch(process.env.ARTICLES_DOWNLOAD_URL);
  Logger.trace("API Response", response);

  const text = await response.text();
  Logger.trace("Extracted Text", text);

  const articles: Article[] = [];

  return new Promise((resolve, reject) => {
    parseString(text, { headers: true })
      .on("data", (row) => articles.push(convertRawArticle(row)))
      .on("error", (err) => reject(err))
      .on("end", () => {
        Logger.info(`Loaded ${articles.length} articles.`);
        Logger.trace("Articles", JSON.stringify(articles));
        resolve(articles);
      });
  });
};

type RawArticle = {
  Title: string;
  "Identifier(s)": string;
  "Accident Type": string;
  "Date(s)": string;
  "Aircraft(s)": string;
  "Location(s)": string;
  "Release Date": string;
  Reddit: string;
  Medium: string;
};

const convertRawArticle = (raw: RawArticle): Article => {
  const {
    Title: title,
    Reddit: reddit,
    Medium: medium,
    "Accident Type": type,
  } = raw;

  const identifiers = raw["Identifier(s)"].split("/");
  const dates = raw["Date(s)"].split("/").map((d) => new Date(d));
  const aircrafts = raw["Aircraft(s)"].split("/");
  const locations = raw["Location(s)"].split("/");

  const releaseDate = new Date(raw["Release Date"]);
  return {
    title,
    releaseDate,
    accident: {
      type,
      identifiers,
      dates,
      aircrafts,
      locations,
    },
    links: { reddit, medium },
  };
};
