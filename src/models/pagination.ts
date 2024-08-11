import { Article } from "./article";

type DisabledButtons = {
  prev: boolean;
  next: boolean;
};

export type PaginatedArticles = {
  articles: Article[];
  footer: {
    start: number;
    end: number;
    max: number;
    page: number;
    maxPage: number;
  };
};

export class Pagination {
  private PAGE_ARTICLE_LIMIT = 10;

  private page: number;
  private pageCount: number;
  private articles: Article[];

  constructor(articles: Article[]) {
    this.page = 0;
    this.articles = articles;
    this.pageCount = Math.ceil(articles.length / this.PAGE_ARTICLE_LIMIT);
  }

  public getPaginatedArticles(): PaginatedArticles {
    return {
      footer: {
        start: 0,
        end: 0,
        max: this.articles.length,
        page: this.page + 1,
        maxPage: this.pageCount,
      },
      articles: this.articles.slice(0, 5),
    };
  }

  public getDisabledButtons(): DisabledButtons {
    return {
      prev: this.page === 0,
      next: this.page === this.pageCount,
    };
  }
}
