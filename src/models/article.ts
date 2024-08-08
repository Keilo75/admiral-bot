export type Article = {
  title: string;
  releaseDate: Date;
  links: {
    medium: string;
    reddit: string;
  };
  accident: {
    type: string;
    identifiers: string[];
    dates: Date[];
    aircrafts: string[];
    locations: string[];
  };
};
