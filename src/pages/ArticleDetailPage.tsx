import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getArticleById } from '../utils/sampleData';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Get article from sample data
  const article = id ? getArticleById(id) : undefined;

  // Redirect to home if article not found
  if (!article) {
    return <Navigate to="/" replace />;
  }

  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 5: return 'bg-red-500';
      case 4: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-blue-500';
      case 1: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {article.topic} • {article.subTopic}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full ${getImportanceColor(article.importance)}`}></span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Importance Level {article.importance}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>{format(article.date, 'MMMM dd, yyyy')}</span>
            <span>Source: {article.source}</span>
          </div>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">One Liner</h2>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {article.content.oneLiner}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prelims</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.content.prelims}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mains</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.content.mains}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Detailed Analysis</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.content.detailed}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage; 