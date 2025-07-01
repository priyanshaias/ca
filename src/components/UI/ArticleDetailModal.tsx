import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { NewsArticle } from '../../types';
import NotesEditor from './NotesEditor';

interface ArticleDetailModalProps {
  article: NewsArticle;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
  onNavigate,
  hasPrev,
  hasNext
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle navigation keys
  useEffect(() => {
    const handleNavigation = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'ArrowLeft' && hasPrev) {
        onNavigate('prev');
      } else if (event.key === 'ArrowRight' && hasNext) {
        onNavigate('next');
      }
    };

    document.addEventListener('keydown', handleNavigation);
    return () => document.removeEventListener('keydown', handleNavigation);
  }, [isOpen, hasPrev, hasNext, onNavigate]);

  if (!isOpen) return null;

  const calculateReadTime = (text: string): number => {
    const words = text.split(' ').length;
    const readTime = Math.ceil(words / 200);
    return Math.max(1, readTime);
  };

  const readTime = calculateReadTime(article.content.detailed);

  const getTopicColor = (topic: string) => {
    const colors = {
      'Economy': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Science & Tech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'National': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'International': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Environment': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const printArticle = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${article.title}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; }
              .content { text-align: justify; }
              .tags { margin-top: 20px; }
              .tag { background: #f0f0f0; padding: 2px 8px; margin-right: 5px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>${article.title}</h1>
            <div class="meta">
              <strong>Date:</strong> ${format(article.date, 'MMMM dd, yyyy')}<br>
              <strong>Topic:</strong> ${article.topic} - ${article.subTopic}<br>
              <strong>Source:</strong> ${article.source}<br>
              <strong>Read Time:</strong> ${readTime} minutes
            </div>
            <div class="content">
              ${article.content.detailed}
            </div>
            <div class="tags">
              ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTopicColor(article.topic)}`}>
                {article.topic}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(article.date, 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Notes Toggle */}
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  showNotes 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Toggle Notes"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Share Button */}
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                title="Copy Link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              {/* Print Button */}
              <button
                onClick={printArticle}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                title="Print Article"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-120px)]">
            {/* Article Content */}
            <div className={`${showNotes ? 'w-2/3' : 'w-full'} p-6 overflow-y-auto`}>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readTime} min read
                </span>
                <span>Source: {article.source}</span>
                <span>Importance: {article.importance}/5</span>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {article.content.detailed}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div className="w-1/3 border-l border-gray-200 dark:border-gray-700">
                <NotesEditor articleId={article.id} />
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => onNavigate('prev')}
              disabled={!hasPrev}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                hasPrev
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Use arrow keys to navigate
            </div>

            <button
              onClick={() => onNavigate('next')}
              disabled={!hasNext}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                hasNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
              }`}
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal; 