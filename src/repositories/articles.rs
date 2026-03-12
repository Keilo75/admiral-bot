use arc_swap::ArcSwap;
use csv::Reader;
use derive_more::Display;
use exn::{Result, ResultExt};
use rand::{rngs::StdRng, seq::SliceRandom};
use reqwest::Client;
use serde::Deserialize;
use std::{
    collections::HashMap,
    hash::{DefaultHasher, Hash, Hasher},
    sync::Arc,
};
use tokio::sync::RwLock;

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
    pub id: String,
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
        let id = id.finish().to_string();

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
    articles: ArcSwap<HashMap<String, Arc<Article>>>,
    random_article_ids: RwLock<Vec<String>>,
    last_random_article_id: ArcSwap<Option<String>>,
}

impl ArticlesRepository {
    pub async fn initialize(articles_csv_url: String) -> Result<Self, ArticlesRepositoryError> {
        let client = Client::new();
        let repository = Self {
            client,
            articles_csv_url,
            articles: ArcSwap::from_pointee(HashMap::new()),
            random_article_ids: RwLock::new(Vec::new()),
            last_random_article_id: ArcSwap::from_pointee(None),
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

        let mut articles = HashMap::new();

        let mut reader = Reader::from_reader(response_text.as_bytes());
        for result in reader.deserialize() {
            let article: ArticleDTO = result
                .or_raise(|| ArticlesRepositoryError("failed to deserialize csv entry".into()))?;

            let article: Article = article.into();
            articles.insert(article.id.clone(), Arc::new(article));
        }

        self.articles.store(Arc::new(articles));
        self.shuffle_random_article_ids().await;

        Ok(())
    }

    pub fn count(&self) -> usize {
        let articles = self.articles.load();
        articles.len()
    }

    pub fn get_by_id(&self, id: &str) -> Option<Arc<Article>> {
        let articles = self.articles.load();
        articles.get(id).cloned()
    }

    pub fn get_by_title_or_identifier(&self, title_or_identifier: &str) -> Vec<Arc<Article>> {
        if title_or_identifier.is_empty() {
            return Vec::new();
        }

        const ARTICLE_LIMIT: usize = 10;

        let articles = self.articles.load();

        articles
            .values()
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

    pub async fn get_random(&self) -> Option<Arc<Article>> {
        loop {
            if let Some(article_id) = {
                let mut ids = self.random_article_ids.write().await;
                ids.pop()
            } {
                let articles = self.articles.load();
                let article = articles.get(&article_id).cloned()?;

                self.last_random_article_id
                    .store(Arc::new(Some(article_id)));
                return Some(article);
            }

            self.shuffle_random_article_ids().await;
        }
    }

    async fn shuffle_random_article_ids(&self) {
        let mut rng: StdRng = rand::make_rng();

        let articles = self.articles.load();
        let mut article_ids = articles.keys().cloned().collect::<Vec<_>>();

        let last_article_id = self.last_random_article_id.load();

        article_ids.shuffle(&mut rng);
        if let Some(last_article_id) = last_article_id.as_ref()
            && article_ids.len() > 1
            && article_ids
                .last()
                .is_some_and(|article_id| article_id == last_article_id)
        {
            let last_index = article_ids.len() - 1;
            article_ids.swap(0, last_index);
        }

        let mut random_article_ids = self.random_article_ids.write().await;
        *random_article_ids = article_ids;
    }
}
