import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleView, { ViewMode } from '../components/UI/ArticleView';
import { loadSampleArticles } from '../utils/sampleData';

const ArticleViewDemoPage: React.FC = () => {
  const articles = loadSampleArticles();
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>('detailed');

  const selectedArticle = articles[selectedArticleIndex];

  const handleModeChange = (mode: ViewMode) => {
    setCurrentViewMode(mode);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Article View Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the ArticleView component with different view modes and articles
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Article Selector Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Article
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {articles.map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticleIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedArticleIndex === index
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${
                        selectedArticleIndex === index
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{article.topic}</span>
                        <span>•</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: article.importance }, (_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({article.importance}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* View Mode Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                View Modes
              </h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">D:</span>
                  <span>Detailed view</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">P:</span>
                  <span>Prelims format</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">M:</span>
                  <span>Mains format</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">O:</span>
                  <span>One-liner format</span>
                </div>
              </div>
            </div>

            {/* Current Article Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Current Article
              </h4>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <div><strong>Title:</strong> {selectedArticle.title}</div>
                <div><strong>Topic:</strong> {selectedArticle.topic}</div>
                <div><strong>Sub-topic:</strong> {selectedArticle.subTopic}</div>
                <div><strong>Date:</strong> {new Date(selectedArticle.date).toLocaleDateString()}</div>
                <div><strong>Importance:</strong> {selectedArticle.importance}/5</div>
                <div><strong>Tags:</strong> {selectedArticle.tags.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Article View */}
        <div className="lg:col-span-3">
          <ArticleView
            article={selectedArticle}
            initialMode={currentViewMode}
            onModeChange={handleModeChange}
          />
        </div>
      </div>

      {/* Features Showcase */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Features
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
              Switch between Detailed, Prelims, Mains, and One-liner views with different formatting for each.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use D, P, M, O keys to quickly switch between view modes without clicking.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Memory</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your preferred view mode is remembered across sessions using localStorage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Print Ready</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Print-friendly styling with proper typography and layout for physical copies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleViewDemoPage; 