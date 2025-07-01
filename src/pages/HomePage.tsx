import React, { useState, useMemo } from 'react';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import ArticleDetailModal from '../components/UI/ArticleDetailModal';
import { loadSampleArticles } from '../utils/sampleData';

const HomePage: React.FC = () => {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilteredResults, setShowFilteredResults] = useState(false);

  const allArticles = loadSampleArticles();

  // Get articles with notes for display
  const articlesWithNotes = useMemo(() => {
    return allArticles.filter(article => {
      const savedNotes = localStorage.getItem(`article-notes-${article.id}`);
      return savedNotes && JSON.parse(savedNotes).length > 0;
    }).map(article => article.id);
  }, [allArticles]);

  const selectedArticle = selectedArticleIndex !== null ? allArticles[selectedArticleIndex] : null;

  const handleArticleClick = (index: number) => {
    setSelectedArticleIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticleIndex(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (selectedArticleIndex === null) return;

    if (direction === 'prev' && selectedArticleIndex > 0) {
      setSelectedArticleIndex(selectedArticleIndex - 1);
    } else if (direction === 'next' && selectedArticleIndex < allArticles.length - 1) {
      setSelectedArticleIndex(selectedArticleIndex + 1);
    }
  };

  const hasPrevious = selectedArticleIndex !== null && selectedArticleIndex > 0;
  const hasNext = selectedArticleIndex !== null && selectedArticleIndex < allArticles.length - 1;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Filter Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Current Affairs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with the latest news and analysis
            </p>
          </div>
          <button
            onClick={() => setShowFilteredResults(!showFilteredResults)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showFilteredResults ? 'Show All Articles' : 'Show Filtered Results'}
          </button>
        </div>
      </div>

      {/* Filtered Results Section */}
      {showFilteredResults && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Filtered Results
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Use the sidebar filters to narrow down results
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <svg className="w-16 h-16 text-blue-300 dark:text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Use Sidebar Filters
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                The filtered results will appear here based on your sidebar filter selections.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles Section */}
      {!showFilteredResults && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Featured Articles
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {allArticles.slice(0, 6).length} article{allArticles.slice(0, 6).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.slice(0, 6).map((article, index) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(index)}
                className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
              >
                <ArticleCard 
                  article={article} 
                  hasNotes={articlesWithNotes.includes(article.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest News Section */}
      {!showFilteredResults && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Latest News
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {allArticles.slice(6, 12).length} article{allArticles.slice(6, 12).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.slice(6, 12).map((article, index) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(index + 6)}
                className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
              >
                <ArticleCard 
                  article={article} 
                  hasNotes={articlesWithNotes.includes(article.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Articles Section */}
      {!showFilteredResults && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All Articles
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {allArticles.length} article{allArticles.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((article, index) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(index)}
                className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
              >
                <ArticleCard 
                  article={article} 
                  hasNotes={articlesWithNotes.includes(article.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

export default HomePage; 