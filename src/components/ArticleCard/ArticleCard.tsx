import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { NewsArticle } from '../../types';
import { useViewMode, LayoutMode } from '../../contexts/ViewModeContext';

interface ArticleCardProps {
  article: NewsArticle;
  hasNotes?: boolean;
  layout?: LayoutMode;
  onClick?: (article: NewsArticle) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, hasNotes = false, layout = 'card', onClick }) => {
  const { viewMode } = useViewMode();

  // Calculate read time (average reading speed: 200 words per minute)
  const calculateReadTime = (text: string): number => {
    const words = text.split(' ').length;
    const readTime = Math.ceil(words / 200);
    return Math.max(1, readTime); // Minimum 1 minute
  };

  // Get content based on view mode
  const getContentForViewMode = () => {
    switch (viewMode) {
      case 'detailed':
        return article.content.detailed;
      case 'prelims':
        return article.content.prelims;
      case 'mains':
        return article.content.mains;
      case 'one-liner':
        return article.content.oneLiner;
      default:
        return article.content.detailed;
    }
  };

  // Get topic badge color
  const getTopicColor = (topic: string) => {
    const colors = {
      'Economy': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700',
      'Science & Tech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      'National': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700',
      'International': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      'Environment': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  // Get sub-topic badge color (lighter version of topic color)
  const getSubTopicColor = (topic: string) => {
    const colors = {
      'Economy': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-600',
      'Science & Tech': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-600',
      'National': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-600',
      'International': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-600',
      'Environment': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-600',
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-100 dark:border-gray-600';
  };

  // Star rating component
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {rating}/5
        </span>
      </div>
    );
  };

  // Truncate title if too long
  const truncateTitle = (title: string, maxLength: number = 80) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  // Truncate preview text
  const truncatePreview = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const currentContent = getContentForViewMode();
  const readTime = calculateReadTime(currentContent);

  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(article);
    }
  };

  // List View Layout
  if (layout === 'list') {
    const CardContent = () => (
      <div className="group bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTopicColor(article.topic)}`}>
                  {article.topic}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSubTopicColor(article.topic)}`}>
                  {article.subTopic}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(article.date, 'MMM dd, yyyy')}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                {truncateTitle(article.title, 120)}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {truncatePreview(currentContent, 150)}
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              <StarRating rating={article.importance} />
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{readTime} min</span>
                {hasNotes && (
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (onClick) {
      return (
        <button onClick={handleClick} className="w-full text-left">
          <CardContent />
        </button>
      );
    }

    return (
      <Link to={`/article/${article.id}`}>
        <CardContent />
      </Link>
    );
  }

  // Table View Layout
  if (layout === 'table') {
    const CardContent = () => (
      <div className="group bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
        <div className="p-3">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                {truncateTitle(article.title, 60)}
              </h3>
            </div>
            
            <div className="col-span-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTopicColor(article.topic)}`}>
                {article.topic}
              </span>
            </div>
            
            <div className="col-span-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {format(article.date, 'MMM dd')}
              </span>
            </div>
            
            <div className="col-span-2">
              <StarRating rating={article.importance} />
            </div>
            
            <div className="col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {readTime}m
              </span>
            </div>
            
            <div className="col-span-1 flex justify-end">
              {hasNotes && (
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    if (onClick) {
      return (
        <button onClick={handleClick} className="w-full text-left">
          <CardContent />
        </button>
      );
    }

    return (
      <Link to={`/article/${article.id}`}>
        <CardContent />
      </Link>
    );
  }

  // Default Card View Layout
  const CardContent = () => (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        {/* Header with topic badges and importance */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTopicColor(article.topic)}`}>
              {article.topic}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSubTopicColor(article.topic)}`}>
              {article.subTopic}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StarRating rating={article.importance} />
            {hasNotes && (
              <div className="relative group/notes">
                <svg className="w-5 h-5 text-yellow-500 hover:text-yellow-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                
                {/* Tooltip */}
                <div className="absolute right-0 top-8 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover/notes:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Has notes - Click to view</span>
                  </div>
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Article Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          {truncateTitle(article.title)}
        </h3>

        {/* Preview Text - Show only content for current view mode */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncatePreview(currentContent)}
        </p>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(article.date, 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime} min read
            </span>
          </div>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {article.source}
          </span>
        </div>

        {/* Tags - Only show in detailed mode */}
        {viewMode === 'detailed' && (
          <div className="mt-4 flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-400 dark:text-gray-500 text-xs">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={handleClick} className="w-full text-left">
        <CardContent />
      </button>
    );
  }

  return (
    <Link to={`/article/${article.id}`}>
      <CardContent />
    </Link>
  );
};

export default ArticleCard; 