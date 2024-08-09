import { Article } from "./article";

export class Context {
  private articles: Article[];

  private recentRandomArticleIds: string[];
  private RECENT_ARTICLE_LIMIT = 10;

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
}
