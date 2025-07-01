import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import ArticleDetailModal from '../components/UI/ArticleDetailModal';
import { loadSampleArticles } from '../utils/sampleData';

const ModalDemoPage: React.FC = () => {
  const articles = loadSampleArticles();
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedArticle = selectedArticleIndex !== null ? articles[selectedArticleIndex] : null;

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
    } else if (direction === 'next' && selectedArticleIndex < articles.length - 1) {
      setSelectedArticleIndex(selectedArticleIndex + 1);
    }
  };

  const hasPrevious = selectedArticleIndex !== null && selectedArticleIndex > 0;
  const hasNext = selectedArticleIndex !== null && selectedArticleIndex < articles.length - 1;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Article Detail Modal Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the ArticleDetailModal with navigation and notes functionality
            </p>
          </div>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to Test
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <h3 className="font-medium mb-2">Modal Features:</h3>
            <ul className="space-y-1">
              <li>• Click any article card to open the modal</li>
              <li>• Use ESC key or click outside to close</li>
              <li>• Navigate between articles with Previous/Next buttons</li>
              <li>• Toggle notes panel with the notes button</li>
              <li>• Add notes with Ctrl+Enter shortcut</li>
              <li>• Copy article link or print the article</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">View Modes:</h3>
            <ul className="space-y-1">
              <li>• Switch between Detailed, Prelims, Mains, One-liner</li>
              <li>• Use keyboard shortcuts: D, P, M, O</li>
              <li>• Notes are saved per article in localStorage</li>
              <li>• Modal is responsive on mobile and desktop</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(index)}
            className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
          >
            <ArticleCard 
              article={article} 
              hasNotes={false} // We'll show notes in the modal instead
            />
          </div>
        ))}
      </div>

      {/* Modal */}
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

      {/* Features Showcase */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Modal Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4 View Modes</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Switch between Detailed, Prelims, Mains, and One-liner views with keyboard shortcuts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes Integration</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add, view, and manage notes for each article with persistent storage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Navigate between articles with Previous/Next buttons and keyboard shortcuts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share & Print</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Copy article links and print articles with optimized layouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDemoPage; 