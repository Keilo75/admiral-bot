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
    const start = this.page * this.PAGE_ARTICLE_LIMIT;
    const end = Math.min(
      (this.page + 1) * this.PAGE_ARTICLE_LIMIT,
      this.articles.length
    );

    return {
      footer: {
        start: start + 1,
        end,
        max: this.articles.length,
        page: this.page + 1,
        maxPage: this.pageCount,
      },
      articles: this.articles.slice(start, end),
    };
  }

  public getDisabledButtons(): DisabledButtons {
    return {
      prev: this.page === 0,
      next: this.page + 1 === this.pageCount,
    };
  }

  public goToNextPage() {
    this.page += 1;
  }

  public goToPrevPage() {
    this.page -= 1;
  }
}
