import React, { useState, useCallback } from 'react';
import { NewsArticle } from '../types';
import { useNews } from '../contexts/NewsContext';
import { useViewMode } from '../contexts/ViewModeContext';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import SearchBar from '../components/UI/SearchBar';
import DateFilter from '../components/UI/DateFilter';
import TopicFilter from '../components/UI/TopicFilter';
import ImportanceFilter from '../components/UI/ImportanceFilter';
import FilterManager from '../components/UI/FilterManager';
import ArticleDetailModal from '../components/UI/ArticleDetailModal';

const AdvancedSearchPage: React.FC = () => {
  const { 
    articles, 
    filteredArticles, 
    filterState, 
    setFilterState, 
    clearFilters 
  } = useNews();
  const { layoutMode } = useViewMode();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);

  // Use filtered articles for display
  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles;

  // Handler functions for filter components
  const handleSearchChange = useCallback((query: string) => {
    setFilterState({
      ...filterState,
      searchQuery: query
    });
  }, [filterState, setFilterState]);

  const handleDateRangeChange = useCallback((dateRange: { start: Date; end: Date } | null) => {
    setFilterState({
      ...filterState,
      dateRange: dateRange ? { start: dateRange.start, end: dateRange.end } : { start: null, end: null }
    });
  }, [filterState, setFilterState]);

  const handleTopicChange = useCallback((topics: string[]) => {
    setFilterState({
      ...filterState,
      selectedTopics: topics
    });
  }, [filterState, setFilterState]);

  const handleSubTopicChange = useCallback((subTopics: string[]) => {
    setFilterState({
      ...filterState,
      selectedSubTopics: subTopics
    });
  }, [filterState, setFilterState]);

  const handleImportanceChange = useCallback((min: number, max: number) => {
    setFilterState({
      ...filterState,
      minImportance: min,
      maxImportance: max
    });
  }, [filterState, setFilterState]);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    const index = displayArticles.findIndex(a => a.id === article.id);
    setSelectedArticleIndex(index);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    setSelectedArticleIndex(null);
  };

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (selectedArticleIndex === null) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = Math.max(0, selectedArticleIndex - 1);
    } else {
      newIndex = Math.min(displayArticles.length - 1, selectedArticleIndex + 1);
    }

    setSelectedArticleIndex(newIndex);
    setSelectedArticle(displayArticles[newIndex]);
  }, [selectedArticleIndex, displayArticles]);

  const hasPrevious = selectedArticleIndex !== null && selectedArticleIndex > 0;
  const hasNext = selectedArticleIndex !== null && selectedArticleIndex < displayArticles.length - 1;

  // Get layout-specific container classes
  const getContainerClasses = () => {
    switch (layoutMode) {
      case 'list':
        return 'space-y-0 divide-y divide-gray-200 dark:divide-gray-700';
      case 'table':
        return 'space-y-0 divide-y divide-gray-200 dark:divide-gray-700';
      default: // card
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  // Get layout-specific wrapper classes
  const getWrapperClasses = () => {
    switch (layoutMode) {
      case 'list':
        return 'bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden';
      case 'table':
        return 'bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden';
      default: // card
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Use multiple filters to find exactly what you're looking for
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearchChange} />

          {/* Filter Manager */}
          <FilterManager 
            articles={articles}
            filterState={filterState}
            onFilterChange={setFilterState}
            onResetFilters={clearFilters}
          />

          {/* Individual Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DateFilter onDateRangeChange={handleDateRangeChange} />
            <TopicFilter 
              selectedTopics={filterState.selectedTopics}
              selectedSubTopics={filterState.selectedSubTopics}
              onTopicChange={handleTopicChange}
              onSubTopicChange={handleSubTopicChange}
            />
            <ImportanceFilter 
              minImportance={filterState.minImportance}
              maxImportance={filterState.maxImportance}
              onImportanceChange={handleImportanceChange}
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Search Results
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {displayArticles.length} article{displayArticles.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Articles Grid/List/Table */}
        <div className={getWrapperClasses()}>
          <div className={getContainerClasses()}>
            {displayArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                layout={layoutMode}
                hasNotes={false}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {displayArticles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Article Detail Modal */}
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
      </div>
    </div>
  );
};

export default AdvancedSearchPage; 