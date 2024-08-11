import { t } from "i18next";

import {
  type Article,
  type FilteredArticle,
  getArticleValueByColumn,
  type SearchableColumn,
} from "./article";

export class Context {
  private articles: Article[];

  private recentArticleIDs: string[];
  private RECENT_ARTICLE_LIMIT = 10;
  private FILTER_ARTICLE_LIMIT = 5;
  private PAGE_ARTICLE_LIMIT = 10;

  constructor() {
    this.articles = [];
    this.recentArticleIDs = [];
  }

  private addToRecentArticleIDs(id: string) {
    this.recentArticleIDs.push(id);
    if (this.recentArticleIDs.length > this.RECENT_ARTICLE_LIMIT) {
      this.recentArticleIDs.shift();
    }
  }

  public populateArticles(articles: Article[]) {
    this.articles = articles;
  }

  public getRandomArticle(): Article {
    let article: Article;

    do {
      const randomIndex = Math.floor(Math.random() * this.articles.length);
      article = this.articles[randomIndex];
    } while (this.recentArticleIDs.includes(article.id));

    this.addToRecentArticleIDs(article.id);
    return article;
  }

  public getArticleByID(id: string): Article | null {
    const article = this.articles.find((a) => a.id === id);
    if (article) this.addToRecentArticleIDs(article.id);
    return article || null;
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

  public filterArticlesByQuery(
    column: SearchableColumn,
    query: string
  ): Article[] {
    const filtered: Article[] = [];

    const lowercaseQuery = query.toLowerCase();
    for (const article of this.articles) {
      const value = getArticleValueByColumn(article, column);
      if (value.toLowerCase().includes(lowercaseQuery)) filtered.push(article);
    }

    return filtered;
  }
}
