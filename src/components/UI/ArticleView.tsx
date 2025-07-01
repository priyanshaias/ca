import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { useViewMode } from '../../contexts/ViewModeContext';

interface ArticleViewProps {
  article: NewsArticle;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article }) => {
  const { viewMode } = useViewMode();
  const [currentContent, setCurrentContent] = useState<string>('');

  // Update content when view mode changes
  useEffect(() => {
    switch (viewMode) {
      case 'detailed':
        setCurrentContent(article.content.detailed);
        break;
      case 'prelims':
        setCurrentContent(article.content.prelims);
        break;
      case 'mains':
        setCurrentContent(article.content.mains);
        break;
      case 'one-liner':
        setCurrentContent(article.content.oneLiner);
        break;
      default:
        setCurrentContent(article.content.detailed);
    }
  }, [viewMode, article.content]);

  const calculateWordCount = (text: string): number => {
    return text.trim().split(/\s+/).length;
  };

  const wordCount = calculateWordCount(currentContent);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {wordCount} words
          </span>
        </div>
        
        <div className="h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {currentContent}
        </div>
      </div>

      {/* View mode indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Currently viewing in {viewMode} mode</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleView; 