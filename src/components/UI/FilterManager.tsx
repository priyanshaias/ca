import React, { useMemo, useCallback } from 'react';
import { NewsArticle } from '../../types';

export interface FilterState {
  searchQuery: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  selectedTopics: string[];
  selectedSubTopics: string[];
  minImportance: number;
  maxImportance: number;
}

interface FilterManagerProps {
  articles: NewsArticle[];
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  onResetFilters: () => void;
  className?: string;
}

interface FilterStats {
  totalArticles: number;
  filteredArticles: number;
  activeFilters: number;
  filterBreakdown: {
    search: boolean;
    date: boolean;
    topics: boolean;
    importance: boolean;
  };
}

const FilterManager: React.FC<FilterManagerProps> = ({
  articles,
  filterState,
  onFilterChange,
  onResetFilters,
  className = ''
}) => {
  // Calculate filter statistics
  const filterStats = useMemo((): FilterStats => {
    const totalArticles = articles.length;
    
    // Count active filters
    const filterBreakdown = {
      search: filterState.searchQuery.trim().length > 0,
      date: filterState.dateRange.start !== null || filterState.dateRange.end !== null,
      topics: filterState.selectedTopics.length > 0 || filterState.selectedSubTopics.length > 0,
      importance: filterState.minImportance > 1 || filterState.maxImportance < 5
    };
    
    const activeFilters = Object.values(filterBreakdown).filter(Boolean).length;
    
    // Apply filters to get filtered articles count
    let filteredArticles = articles.filter(article => {
      // Search filter
      if (filterBreakdown.search) {
        const query = filterState.searchQuery.toLowerCase();
        const searchableText = [
          article.title,
          article.content.detailed,
          article.content.prelims,
          article.content.mains,
          article.content.oneLiner,
          ...article.tags
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }
      
      // Date filter
      if (filterBreakdown.date) {
        const articleDate = new Date(article.date);
        if (filterState.dateRange.start && articleDate < filterState.dateRange.start) {
          return false;
        }
        if (filterState.dateRange.end && articleDate > filterState.dateRange.end) {
          return false;
        }
      }
      
      // Topic filter
      if (filterBreakdown.topics) {
        if (filterState.selectedTopics.length > 0 && !filterState.selectedTopics.includes(article.topic)) {
          return false;
        }
        if (filterState.selectedSubTopics.length > 0 && !filterState.selectedSubTopics.includes(article.subTopic)) {
          return false;
        }
      }
      
      // Importance filter
      if (filterBreakdown.importance) {
        if (article.importance < filterState.minImportance || article.importance > filterState.maxImportance) {
          return false;
        }
      }
      
      return true;
    });
    
    return {
      totalArticles,
      filteredArticles: filteredArticles.length,
      activeFilters,
      filterBreakdown
    };
  }, [articles, filterState]);

  // Export current filter state
  const exportFilterState = useCallback(() => {
    const exportData = {
      filterState,
      stats: filterStats,
      timestamp: new Date().toISOString(),
      exportFormat: 'Current Affairs App Filter State'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filter-state-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filterState, filterStats]);

  // Get filter description
  const getFilterDescription = useCallback(() => {
    const descriptions: string[] = [];
    
    if (filterStats.filterBreakdown.search) {
      descriptions.push(`Search: "${filterState.searchQuery}"`);
    }
    
    if (filterStats.filterBreakdown.date) {
      const startStr = filterState.dateRange.start?.toLocaleDateString() || 'Any';
      const endStr = filterState.dateRange.end?.toLocaleDateString() || 'Any';
      descriptions.push(`Date: ${startStr} to ${endStr}`);
    }
    
    if (filterStats.filterBreakdown.topics) {
      const topicStr = filterState.selectedTopics.length > 0 
        ? filterState.selectedTopics.join(', ')
        : filterState.selectedSubTopics.join(', ');
      descriptions.push(`Topics: ${topicStr}`);
    }
    
    if (filterStats.filterBreakdown.importance) {
      descriptions.push(`Importance: ${filterState.minImportance}-${filterState.maxImportance}/5`);
    }
    
    return descriptions;
  }, [filterState, filterStats]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Manager
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filterStats.activeFilters > 0 
              ? `${filterStats.activeFilters} active filter${filterStats.activeFilters !== 1 ? 's' : ''}`
              : 'No active filters'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportFilterState}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {filterStats.totalArticles}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Articles
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {filterStats.filteredArticles}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Filtered Articles
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {filterStats.activeFilters}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">
            Active Filters
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filterStats.totalArticles > 0 
              ? Math.round((filterStats.filteredArticles / filterStats.totalArticles) * 100)
              : 0
            }%
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Match Rate
          </div>
        </div>
      </div>

      {/* Active Filters Breakdown */}
      {filterStats.activeFilters > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Active Filters
          </h4>
          <div className="space-y-2">
            {getFilterDescription().map((description, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {description}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Logic Explanation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Filter Logic
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              All filters work with AND logic - articles must match ALL active filters to be included in results. 
              Search looks in titles, content, and tags. Date ranges are inclusive.
            </p>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filterStats.filteredArticles === 0 && filterStats.activeFilters > 0 && (
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                No articles match your filters
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Try adjusting your filter criteria or use the "Reset All" button to start over.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterManager; 