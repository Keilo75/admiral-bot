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
