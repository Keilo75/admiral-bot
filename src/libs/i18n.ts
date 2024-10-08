import { escapeMarkdown } from "discord.js";
import i18next, { t } from "i18next";

import en from "../assets/en.json";

i18next.init({
  lng: "en",
  resources: {
    en: {
      translation: en,
    },
  },
  interpolation: { escapeValue: false },
});

i18next.services.formatter?.add("list-short", (values: string[]) => {
  return values.join(t("format.sep-short"));
});

i18next.services.formatter?.add("list-long", (values: string[]) => {
  return values.join(t("format.sep-long"));
});

i18next.services.formatter?.add("list-dots", (values: string[]) => {
  return values.join(t("format.sep-dots"));
});

i18next.services.formatter?.add("escape-markdown", (value: string) => {
  return escapeMarkdown(value.replace(/`/g, ""));
});

i18next.services.formatter?.add("duration", (value: number) => {
  const [hours, minutes, seconds] = new Date(value)
    .toISOString()
    .slice(11, 19)
    .split(":");

  return `${hours}h ${minutes}m ${seconds}s`;
});
