import sampleArticlesData from '../sample-data/news-articles.json';
import { NewsArticle, DateRange } from '../types';

// Parse the JSON data and convert date strings to Date objects
export const loadSampleArticles = (): NewsArticle[] => {
  return sampleArticlesData.map(article => ({
    ...article,
    date: new Date(article.date),
    importance: article.importance as 1 | 2 | 3 | 4 | 5
  }));
};

// Get articles by topic
export const getArticlesByTopic = (topic: string): NewsArticle[] => {
  return loadSampleArticles().filter(article => 
    article.topic.toLowerCase() === topic.toLowerCase()
  );
};

// Get articles by importance level
export const getArticlesByImportance = (importance: number): NewsArticle[] => {
  return loadSampleArticles().filter(article => 
    article.importance === importance
  );
};

// Get articles by date range
export const getArticlesByDateRange = (dateRange: DateRange): NewsArticle[] => {
  return loadSampleArticles().filter(article => 
    article.date >= dateRange.start && article.date <= dateRange.end
  );
};

// Get featured articles (high importance articles)
export const getFeaturedArticles = (): NewsArticle[] => {
  return loadSampleArticles()
    .filter(article => article.importance >= 4)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);
};

// Get latest articles
export const getLatestArticles = (): NewsArticle[] => {
  return loadSampleArticles()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12);
};

// Get article by ID
export const getArticleById = (id: string): NewsArticle | undefined => {
  const articles = loadSampleArticles();
  return articles.find(article => article.id === id);
}; 