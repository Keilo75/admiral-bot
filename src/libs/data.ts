import { parseString } from "@fast-csv/parse";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

import config from "../../config.json";
import { Article } from "../models/article";
import { Logger } from "../utils";

const cachePath = path.resolve(__dirname, "cache.json");

export const fetchArticles = async (): Promise<Article[]> => {
  const cache = readFromCache();
  if (process.env.DEV && cache) {
    Logger.log("Reading articles from cache.");
    return cache;
  }

  Logger.log("Fetching articels.");

  const response = await fetch(config.articlesDownloadURL);
  Logger.debug("API Response", response);

  const text = await response.text();
  Logger.debug("Extracted Text", text);

  const articles: Article[] = [];
  await new Promise<void>((resolve, reject) => {
    parseString(text, { headers: true })
      .on("data", (row) => articles.push(convertRawArticle(row)))
      .on("error", (err) => reject(err))
      .on("end", () => {
        resolve();
      });
  });

  Logger.log(`Loaded ${articles.length} articles.`);
  Logger.debug("Articles", JSON.stringify(articles));

  if (process.env.DEV) {
    Logger.log("Writing articles to cache.");
    fs.writeFileSync(cachePath, JSON.stringify(articles));
  }

  return articles;
};

const readFromCache = (): Article[] | null => {
  try {
    const cache = fs.readFileSync(cachePath, { encoding: "utf-8" });
    const articles: Article[] = JSON.parse(cache);

    // TODO: Use zod to parse schema
    return articles.map((a) => ({
      ...a,
      releaseDate: new Date(a.releaseDate),
      accident: {
        ...a.accident,
        dates: a.accident.dates.map((d) => new Date(d)),
      },
    }));
  } catch {
    return null;
  }
};

type RawArticle = {
  Title: string;
  "Identifier(s)": string;
  "Accident Type": string;
  "Date(s)": string;
  Aircraft: string;
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
  const aircraft = raw["Aircraft"].split("/");
  const locations = raw["Location(s)"].split("/");

  const releaseDate = new Date(raw["Release Date"]);
  return {
    id: randomUUID(),
    title,
    releaseDate,
    accident: {
      type,
      identifiers,
      dates,
      aircraft,
      locations,
    },
    links: { reddit, medium },
  };
};
