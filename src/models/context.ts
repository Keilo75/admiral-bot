import { Article } from "./article";

export class Context {
  private articles: Article[];

  constructor() {
    this.articles = [];
  }

  public populateArticles(articles: Article[]) {
    this.articles = articles;
  }

  public getRandomArticle(): Article {
    return this.articles[0];
  }
}
