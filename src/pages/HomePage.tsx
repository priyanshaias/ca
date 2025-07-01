import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { useNews } from '../contexts/NewsContext';
import { useViewMode } from '../contexts/ViewModeContext';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import ArticleDetailModal from '../components/UI/ArticleDetailModal';

const HomePage: React.FC = () => {
  const { articles, filteredArticles } = useNews();
  const { layoutMode } = useViewMode();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);

  // Use filtered articles for display
  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles;

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    const index = displayArticles.findIndex(a => a.id === article.id);
    setSelectedArticleIndex(index);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    setSelectedArticleIndex(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (selectedArticleIndex === null) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = Math.max(0, selectedArticleIndex - 1);
    } else {
      newIndex = Math.min(displayArticles.length - 1, selectedArticleIndex + 1);
    }

    setSelectedArticleIndex(newIndex);
    setSelectedArticle(displayArticles[newIndex]);
  };

  const hasPrevious = selectedArticleIndex !== null && selectedArticleIndex > 0;
  const hasNext = selectedArticleIndex !== null && selectedArticleIndex < displayArticles.length - 1;

  // Get layout-specific container classes
  const getContainerClasses = () => {
    switch (layoutMode) {
      case 'list':
        return 'space-y-0 divide-y divide-gray-200 dark:divide-gray-700';
      case 'table':
        return 'space-y-0 divide-y divide-gray-200 dark:divide-gray-700';
      default: // card
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  // Get layout-specific wrapper classes
  const getWrapperClasses = () => {
    switch (layoutMode) {
      case 'list':
        return 'bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden';
      case 'table':
        return 'bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden';
      default: // card
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Current Affairs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with the latest news and developments
          </p>
        </div>

        {/* Articles Grid/List/Table */}
        <div className={getWrapperClasses()}>
          <div className={getContainerClasses()}>
            {displayArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                layout={layoutMode}
                hasNotes={false} // You can implement notes checking logic here
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {displayArticles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No articles</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding some articles.
            </p>
          </div>
        )}

        {/* Article Detail Modal */}
        {selectedArticle && (
          <ArticleDetailModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onNavigate={handleNavigate}
            hasPrev={hasPrevious}
            hasNext={hasNext}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage; 