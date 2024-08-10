import { describe, expect, it } from "vitest";

import { type Article, buildArticleEmbed, EMPTY_FIELD } from "./article";

const ARTICLE: Article = {
  id: "",
  title: "TEST",
  releaseDate: new Date(2000, 0, 1),
  links: { reddit: "reddit.com", medium: "medium.com" },
  accident: {
    type: "Accident",
    identifiers: ["Flight 1"],
    aircraft: ["Aircraft 1"],
    dates: [new Date(1970, 0, 1)],
    locations: ["Earth"],
  },
};

describe("build article embed", () => {
  it("supports embeds with one accident", () => {
    const { data } = buildArticleEmbed(ARTICLE);
    expect(data.title).toEqual("TEST");
    expect(data.description).toEqual("Flight 1");

    expect(data.fields).toEqual([
      { name: "Accident Type", value: "Accident", inline: true },
      { name: "Accident Date", value: "1970-01-01", inline: true },
      EMPTY_FIELD,
      { name: "Aircraft", value: "Aircraft 1", inline: true },
      { name: "Location", value: "Earth", inline: true },
      EMPTY_FIELD,
      {
        name: "Links",
        value: "[Reddit](reddit.com)\n[Medium](medium.com)",
        inline: true,
      },
      { name: "Release Date", value: "2000-01-01", inline: true },
      EMPTY_FIELD,
    ]);
  });

  it("supports embeds with multiple accidents", () => {
    const { data } = buildArticleEmbed({
      ...ARTICLE,
      accident: {
        type: "Accident",
        identifiers: ["Flight 1", "Flight 2"],
        aircraft: ["Aircraft 1", "Aircraft 2"],
        dates: [new Date(1970, 0, 1), new Date(1970, 0, 2)],
        locations: ["Country 1", "Country 2"],
      },
    });
    expect(data.title).toEqual("TEST");
    expect(data.description).toEqual("Flight 1 and Flight 2");

    expect(data.fields).toEqual([
      { name: "Accident Type", value: "Accident", inline: true },
      {
        name: "Accident Dates",
        value: "1970-01-01 / 1970-01-02",
        inline: true,
      },
      EMPTY_FIELD,
      { name: "Aircraft", value: "Aircraft 1 / Aircraft 2", inline: true },
      { name: "Locations", value: "Country 1 / Country 2", inline: true },
      EMPTY_FIELD,
      {
        name: "Links",
        value: "[Reddit](reddit.com)\n[Medium](medium.com)",
        inline: true,
      },
      { name: "Release Date", value: "2000-01-01", inline: true },
      EMPTY_FIELD,
    ]);
  });

  it("supports embeds with the same aircraft type, location and date", () => {
    const { data } = buildArticleEmbed({
      ...ARTICLE,
      accident: {
        type: "Accident",
        identifiers: ["Flight 1", "Flight 2"],
        aircraft: ["Aircraft 1"],
        dates: [new Date(1970, 0, 1)],
        locations: ["Earth"],
      },
    });
    expect(data.title).toEqual("TEST");
    expect(data.description).toEqual("Flight 1 and Flight 2");

    expect(data.fields).toEqual([
      { name: "Accident Type", value: "Accident", inline: true },
      { name: "Accident Date", value: "1970-01-01", inline: true },
      EMPTY_FIELD,
      { name: "Aircraft", value: "Aircraft 1", inline: true },
      { name: "Location", value: "Earth", inline: true },
      EMPTY_FIELD,
      {
        name: "Links",
        value: "[Reddit](reddit.com)\n[Medium](medium.com)",
        inline: true,
      },
      { name: "Release Date", value: "2000-01-01", inline: true },
      EMPTY_FIELD,
    ]);
  });

  it("supports only one link", () => {
    const { data } = buildArticleEmbed({
      ...ARTICLE,
      links: { reddit: "reddit.com" },
    });

    expect(data.fields).toContainEqual({
      name: "Link",
      value: "[Reddit](reddit.com)",
      inline: true,
    });
  });
});
