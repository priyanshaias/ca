import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle } from '../../types';
import ArticleView, { ViewMode } from './ArticleView';
import NotesEditor from './NotesEditor';

interface ArticleDetailModalProps {
  article: NewsArticle;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  className?: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  lastEdited: Date;
  characterCount: number;
  version: number;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
  onNavigate,
  hasPrevious = false,
  hasNext = false,
  className = ''
}) => {
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>('detailed');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`article-notes-${article.id}`);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, [article.id]);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`article-notes-${article.id}`, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }, [notes, article.id]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setCurrentViewMode(mode);
  }, []);



  // Copy article link
  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/article/${article.id}`;
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, [article.id]);

  // Print article
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Navigate to previous/next article
  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    onNavigate?.(direction);
  }, [onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-7xl h-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Article Detail
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{article.topic}</span>
              <span>•</span>
              <span>{article.subTopic}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notes Toggle */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showNotes
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Toggle Notes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Share Button */}
            <button
              onClick={handleCopyLink}
              className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Copy Link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Print Article"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Close Modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className={`flex-1 flex flex-col ${showNotes ? 'lg:w-2/3' : 'w-full'}`}>
            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleNavigate('prev')}
                disabled={!hasPrevious}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  hasPrevious
                    ? 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{article.source}</span>
                <span>•</span>
                <span>Importance: {article.importance}/5</span>
              </div>

              <button
                onClick={() => handleNavigate('next')}
                disabled={!hasNext}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  hasNext
                    ? 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Article Content */}
            <div className="flex-1 overflow-y-auto">
              <ArticleView
                article={article}
                initialMode={currentViewMode}
                onModeChange={handleViewModeChange}
                className="border-0 shadow-none"
              />
            </div>
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="lg:w-1/3 border-l border-gray-200 dark:border-gray-700">
              <NotesEditor
                articleId={article.id}
                initialNotes={notes}
                onNotesChange={setNotes}
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal; 