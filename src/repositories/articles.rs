use arc_swap::ArcSwap;
use csv::Reader;
use derive_more::Display;
use exn::{Result, ResultExt};
use reqwest::Client;
use serde::Deserialize;
use std::{
    hash::{DefaultHasher, Hash, Hasher},
    sync::Arc,
};

#[derive(Debug, Deserialize)]
struct ArticleDTO {
    #[serde(rename = "Title")]
    title: String,
    #[serde(rename = "Identifier(s)")]
    identifiers: String,
    #[serde(rename = "Accident Type")]
    accident_type: String,
    #[serde(rename = "Date(s)")]
    dates: String,
    #[serde(rename = "Aircraft")]
    aircraft: String,
    #[serde(rename = "Location(s)")]
    locations: String,
    #[serde(rename = "Release Date")]
    release_date: String,
    #[serde(rename = "Reddit")]
    reddit: String,
    #[serde(rename = "Medium")]
    medium: String,
}

#[derive(Debug)]
pub struct Article {
    pub id: u64,
    pub title: String,
    pub release_date: String,
    pub reddit: String,
    pub medium: String,
    pub accident_type: String,
    pub identifiers: Vec<String>,
    pub dates: Vec<String>,
    pub aircraft: Vec<String>,
    pub locations: Vec<String>,
}

impl From<ArticleDTO> for Article {
    fn from(dto: ArticleDTO) -> Self {
        let mut id = DefaultHasher::new();
        dto.title.hash(&mut id);
        let id = id.finish();

        let split_at_slash = |value: String| value.split("/").map(ToString::to_string).collect();

        Self {
            id,
            title: dto.title,
            release_date: dto.release_date,
            reddit: dto.reddit,
            medium: dto.medium,
            accident_type: dto.accident_type,
            identifiers: split_at_slash(dto.identifiers),
            dates: split_at_slash(dto.dates),
            aircraft: split_at_slash(dto.aircraft),
            locations: split_at_slash(dto.locations),
        }
    }
}

#[derive(Debug, Display)]
pub struct ArticlesRepositoryError(String);
impl std::error::Error for ArticlesRepositoryError {}

pub struct ArticlesRepository {
    client: Client,
    articles_csv_url: String,
    articles: ArcSwap<Vec<Arc<Article>>>,
}

impl ArticlesRepository {
    pub async fn initialize(articles_csv_url: String) -> Result<Self, ArticlesRepositoryError> {
        let client = Client::new();
        let repository = Self {
            articles_csv_url,
            client,
            articles: ArcSwap::from_pointee(Vec::new()),
        };

        repository.update_from_csv().await?;

        Ok(repository)
    }

    pub async fn update_from_csv(&self) -> Result<(), ArticlesRepositoryError> {
        let response_text = self
            .client
            .get(&self.articles_csv_url)
            .send()
            .await
            .or_raise(|| ArticlesRepositoryError("failed to send http request".into()))?
            .text()
            .await
            .or_raise(|| ArticlesRepositoryError("failed to get http response text".into()))?;

        let mut articles = Vec::new();

        let mut reader = Reader::from_reader(response_text.as_bytes());
        for result in reader.deserialize() {
            let article: ArticleDTO = result
                .or_raise(|| ArticlesRepositoryError("failed to deserialize csv entry".into()))?;
            articles.push(Arc::new(article.into()));
        }

        self.articles.store(Arc::new(articles));

        Ok(())
    }

    pub fn get_by_title_or_identifier(&self, title_or_identifier: &str) -> Vec<Arc<Article>> {
        if title_or_identifier.is_empty() {
            return Vec::new();
        }

        const ARTICLE_LIMIT: usize = 10;

        let articles = self.articles.load();

        articles
            .iter()
            .filter(|article| {
                let does_title_match = article.title.to_lowercase().contains(&title_or_identifier);
                if does_title_match {
                    true
                } else {
                    article
                        .identifiers
                        .iter()
                        .any(|identifier| identifier.to_lowercase().contains(&title_or_identifier))
                }
            })
            .take(ARTICLE_LIMIT)
            .cloned()
            .collect()
    }
}
