import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsArticle } from '../../types';

export type ViewMode = 'detailed' | 'prelims' | 'mains' | 'one-liner';

interface ArticleViewProps {
  article: NewsArticle;
  initialMode?: ViewMode;
  className?: string;
  onModeChange?: (mode: ViewMode) => void;
}

interface ViewModeConfig {
  key: ViewMode;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  contentKey: keyof NewsArticle['content'];
}

const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  initialMode = 'detailed',
  className = '',
  onModeChange
}) => {
  const [currentMode, setCurrentMode] = useState<ViewMode>(initialMode);

  // View mode configurations - wrapped in useMemo to prevent unnecessary re-renders
  const viewModes: ViewModeConfig[] = useMemo(() => [
    {
      key: 'detailed',
      label: 'Detailed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      shortcut: 'D',
      contentKey: 'detailed'
    },
    {
      key: 'prelims',
      label: 'Prelims',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      shortcut: 'P',
      contentKey: 'prelims'
    },
    {
      key: 'mains',
      label: 'Mains',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      shortcut: 'M',
      contentKey: 'mains'
    },
    {
      key: 'one-liner',
      label: 'One Liners',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      shortcut: 'O',
      contentKey: 'oneLiner'
    }
  ], []);

  // Get current content and word count
  const currentContent = article.content[viewModes.find(mode => mode.key === currentMode)?.contentKey || 'detailed'];
  const wordCount = currentContent.split(' ').length;

  // Handle mode change
  const handleModeChange = useCallback((mode: ViewMode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
    
    // Save to localStorage
    localStorage.setItem('preferred-view-mode', mode);
  }, [onModeChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toUpperCase();
      const mode = viewModes.find(m => m.shortcut === key);
      
      if (mode) {
        event.preventDefault();
        handleModeChange(mode.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleModeChange, viewModes]);

  // Load preferred view mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('preferred-view-mode') as ViewMode;
    if (savedMode && viewModes.some(mode => mode.key === savedMode)) {
      setCurrentMode(savedMode);
    }
  }, [viewModes]);

  // Format content based on mode
  const formatContent = (content: string, mode: ViewMode) => {
    switch (mode) {
      case 'prelims':
        return content.split('\n').map((line, index) => (
          <p key={index} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            {line.trim()}
          </p>
        ));
      
      case 'mains':
        return content.split('\n').map((line, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {line.trim()}
            </p>
          </div>
        ));
      
      case 'one-liner':
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              {content}
            </p>
          </div>
        );
      
      default: // detailed
        return content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {paragraph.trim()}
          </p>
        ));
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{article.topic}</span>
            <span>•</span>
            <span>{article.subTopic}</span>
            <span>•</span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex flex-wrap gap-2">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => handleModeChange(mode.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentMode === mode.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={`${mode.label} (${mode.shortcut})`}
            >
              {mode.icon}
              <span>{mode.label}</span>
              <span className="text-xs opacity-75">({mode.shortcut})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Content Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {viewModes.find(mode => mode.key === currentMode)?.label} View
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print</span>
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="transition-all duration-300 ease-in-out">
            {formatContent(currentContent, currentMode)}
          </div>
        </div>

        {/* Article Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Source:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{article.source}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Importance:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {Array.from({ length: article.importance }, (_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {Array.from({ length: 5 - article.importance }, (_, i) => (
                  <span key={i} className="text-gray-300 dark:text-gray-600">★</span>
                ))}
                <span className="ml-1">({article.importance}/5)</span>
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Use keyboard shortcuts: D, P, M, O</span>
          <span>Current mode: {viewModes.find(mode => mode.key === currentMode)?.label}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleView; 