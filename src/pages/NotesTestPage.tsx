import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleDetailModal from '../components/UI/ArticleDetailModal';
import { loadSampleArticles } from '../utils/sampleData';

const NotesTestPage: React.FC = () => {
  const articles = loadSampleArticles();
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const currentIndex = articles.findIndex(article => article.id === selectedArticle.id);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedArticle(articles[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < articles.length - 1) {
      setSelectedArticle(articles[currentIndex + 1]);
    }
  };

  const hasPrevious = articles.findIndex(article => article.id === selectedArticle.id) > 0;
  const hasNext = articles.findIndex(article => article.id === selectedArticle.id) < articles.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notes Functionality Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the notes functionality in ArticleDetailModal
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

      {/* Test Instructions */}
      <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
        <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          How to Test Notes
        </h2>
        <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
          <p>1. Click "Open Modal" to open the ArticleDetailModal</p>
          <p>2. Click the notes button (pencil icon) in the header to toggle the notes panel</p>
          <p>3. Type in the textarea and click "Add Note" or press Ctrl+Enter</p>
          <p>4. Check the browser console for debugging information</p>
          <p>5. Notes should be saved to localStorage and persist between sessions</p>
          <p>6. You can delete notes by clicking the trash icon</p>
        </div>
      </div>

      {/* Current Article Info */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Current Article
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Title:</strong> {selectedArticle.title}</p>
          <p><strong>Topic:</strong> {selectedArticle.topic}</p>
          <p><strong>Sub-topic:</strong> {selectedArticle.subTopic}</p>
          <p><strong>Date:</strong> {new Date(selectedArticle.date).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-6 space-y-4">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Open Modal
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => {
              const currentIndex = articles.findIndex(article => article.id === selectedArticle.id);
              if (currentIndex > 0) {
                setSelectedArticle(articles[currentIndex - 1]);
              }
            }}
            disabled={!hasPrevious}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              hasPrevious
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Previous Article
          </button>
          
          <button
            onClick={() => {
              const currentIndex = articles.findIndex(article => article.id === selectedArticle.id);
              if (currentIndex < articles.length - 1) {
                setSelectedArticle(articles[currentIndex + 1]);
              }
            }}
            disabled={!hasNext}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              hasNext
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next Article
          </button>
        </div>
      </div>

      {/* localStorage Debug */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          localStorage Debug
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Article ID:</strong> {selectedArticle.id}</p>
          <p><strong>localStorage Key:</strong> article-notes-{selectedArticle.id}</p>
          <p><strong>Current Value:</strong> {localStorage.getItem(`article-notes-${selectedArticle.id}`) || 'null'}</p>
        </div>
      </div>

      {/* Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
};

export default NotesTestPage; 