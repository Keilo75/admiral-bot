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

parseDocsArchive();
