import React from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import { getArticlesByTopic, loadSampleArticles } from '../utils/sampleData';

const TopicsPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();

  // Get articles based on topic parameter or show all articles
  const topicArticles = topic 
    ? getArticlesByTopic(topic)
    : loadSampleArticles();

  const topicName = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : 'All Topics';

  // Demo: Some articles have notes (for demonstration purposes)
  const articlesWithNotes = ['1', '3', '7', '10', '15', '20']; // Article IDs that have notes

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {topicName}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {topicArticles.length} article{topicArticles.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Latest articles and analysis on {topicName.toLowerCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicArticles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            hasNotes={articlesWithNotes.includes(article.id)}
          />
        ))}
      </div>

      {topicArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No articles found for this topic.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicsPage; 