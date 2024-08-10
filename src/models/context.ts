import { t } from "i18next";

import type { Article, FilteredArticle } from "./article";

export class Context {
  private articles: Article[];

  private recentRandomArticleIds: string[];
  private RECENT_ARTICLE_LIMIT = 10;
  private FILTER_ARTICLE_LIMIT = 5;

  constructor() {
    this.articles = [];
    this.recentRandomArticleIds = [];
  }

  public populateArticles(articles: Article[]) {
    this.articles = articles;
  }

  public getRandomArticle(): Article {
    let article: Article;

    do {
      const randomIndex = Math.floor(Math.random() * this.articles.length);
      article = this.articles[randomIndex];
    } while (this.recentRandomArticleIds.includes(article.id));

    this.recentRandomArticleIds.push(article.id);
    if (this.recentRandomArticleIds.length > this.RECENT_ARTICLE_LIMIT) {
      this.recentRandomArticleIds.shift();
    }

    return article;
  }

  public filterArticlesByTitleOrIdentifier(
    titleOrIdentifier: string
  ): FilteredArticle[] {
    const filtered: FilteredArticle[] = [];

    const query = titleOrIdentifier.toLowerCase();
    for (const article of this.articles) {
      const doesTitleMatch = article.title.toLowerCase().includes(query);
      const doesArticleMatch =
        doesTitleMatch ||
        article.accident.identifiers.some((i) =>
          i.toLowerCase().includes(query)
        );

      if (doesArticleMatch) {
        const name = doesTitleMatch
          ? article.title
          : t("format.list-short", { values: article.accident.identifiers });

        filtered.push({ name, value: article.id });
        if (filtered.length >= this.FILTER_ARTICLE_LIMIT) {
          break;
        }
      }
    }

    return filtered;
  }
}
