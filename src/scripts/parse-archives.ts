import fs from "fs";
import path from "path";

type Article = {
  title: string;
  identifiers: string[];
  accidentType: string;
  dates: string[];
  aircrafts: string[];
  locations: string[];
};

type ArticleInfo = {
  title: string;
  releaseDate: string;
  reddit: string;
  medium?: string;
};

function parseDocsArchive() {
  const articles: Article[] = [];

  const lines = fs
    .readFileSync(path.join(__dirname, "archive-docs.md"), "utf-8")
    .split("\n")
    .map((l, i) => [i, l.trim()] as const);

  const accidentTypes = lines
    .filter(([, l]) => l.startsWith("#"))
    .map(([i, l]) => ({ type: l.slice(2), line: i + 2 }));

  for (const { line, type } of accidentTypes) {
    for (let i = line; lines[i][1] !== ""; i += 5) {
      const [title, identifiers, dates, aircrafts, locations] = lines
        .slice(i, i + 5)
        .map(([, l]) => l);

      articles.push({
        title,
        accidentType: type,
        identifiers: identifiers.split(" and "),
        dates: dates.split("|"),
        aircrafts: aircrafts.split(","),
        locations: locations.split("|"),
      });
    }
  }

  const processedLines = articles
    .map((a) => {
      const { accidentType } = a;

      const SEP = "/";
      const title = `"${a.title}"`;
      const identifiers = a.identifiers.join(SEP);
      const dates = a.dates
        .map((d) => new Date(d).toISOString().slice(0, 10))
        .join(SEP);
      const aircrafts = a.aircrafts.join(SEP);
      const locations = `"${a.locations.join(SEP)}"`;

      const values: string[] = [
        title,
        identifiers,
        accidentType,
        dates,
        aircrafts,
        locations,
      ];

      return values.join(",");
    })
    .join("\n");
  fs.writeFileSync(
    path.join(__dirname, "archive-docs-processed.md"),
    processedLines
  );
}

function parseRedditArchive() {
  const articles: ArticleInfo[] = [];

  const lines = fs
    .readFileSync(path.join(__dirname, "archive-reddit.md"), "utf-8")
    .split("\n");

  const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^)]+)\))/gi;
  for (const line of lines) {
    if (line.length < 10) continue;

    const links = [...line.matchAll(regex)].map((m) => ({
      text: m[1],
      link: m[2],
    }));

    const [date, title] = links[0].text.split(": ");
    const reddit = links[0].link;
    const medium = links[1]?.link;

    const [day, month, year] = date.split("/").map((n) => parseInt(n));
    const releaseDate = new Date(year + 2000, month - 1, day)
      .toISOString()
      .slice(0, 10);

    articles.push({ title, releaseDate, reddit, medium });
  }

  const processedLines = articles
    .flatMap(({ title, releaseDate, reddit, medium }) => {
      const info = [releaseDate, reddit];
      if (medium) info.push(medium);

      return [[title], info];
    })
    .join("\n");

  fs.writeFileSync(
    path.join(__dirname, "archive-reddit-processed.md"),
    processedLines
  );
}

parseDocsArchive();
parseRedditArchive();
