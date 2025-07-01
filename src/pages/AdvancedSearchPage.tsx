import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import SearchBar from '../components/UI/SearchBar';
import DateFilter from '../components/UI/DateFilter';
import TopicFilter from '../components/UI/TopicFilter';
import ImportanceFilter from '../components/UI/ImportanceFilter';
import FilterManager, { FilterState } from '../components/UI/FilterManager';
import { loadSampleArticles } from '../utils/sampleData';

const AdvancedSearchPage: React.FC = () => {
  const allArticles = loadSampleArticles();
  
  // Demo: Some articles have notes (for demonstration purposes)
  const articlesWithNotes = ['1', '3', '7', '10', '15', '20', '25', '28'];

  // Initial filter state
  const initialFilterState: FilterState = useMemo(() => ({
    searchQuery: '',
    dateRange: {
      start: null,
      end: null
    },
    selectedTopics: [],
    selectedSubTopics: [],
    minImportance: 1,
    maxImportance: 5
  }), []);

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Apply all filters to articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      // Search filter
      if (filterState.searchQuery.trim()) {
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
      if (filterState.dateRange.start || filterState.dateRange.end) {
        const articleDate = new Date(article.date);
        if (filterState.dateRange.start && articleDate < filterState.dateRange.start) {
          return false;
        }
        if (filterState.dateRange.end && articleDate > filterState.dateRange.end) {
          return false;
        }
      }
      
      // Topic filter
      if (filterState.selectedTopics.length > 0 || filterState.selectedSubTopics.length > 0) {
        if (filterState.selectedTopics.length > 0 && !filterState.selectedTopics.includes(article.topic)) {
          return false;
        }
        if (filterState.selectedSubTopics.length > 0 && !filterState.selectedSubTopics.includes(article.subTopic)) {
          return false;
        }
      }
      
      // Importance filter
      if (filterState.minImportance > 1 || filterState.maxImportance < 5) {
        if (article.importance < filterState.minImportance || article.importance > filterState.maxImportance) {
          return false;
        }
      }
      
      return true;
    });
  }, [allArticles, filterState]);

  // Filter state update handlers
  const handleSearchChange = useCallback((query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleDateRangeChange = useCallback((dateRange: { start: Date; end: Date; } | null) => {
    setFilterState(prev => ({ 
      ...prev, 
      dateRange: { 
        start: dateRange?.start || null, 
        end: dateRange?.end || null 
      } 
    }));
  }, []);

  const handleTopicChange = useCallback((topics: string[]) => {
    setFilterState(prev => ({ ...prev, selectedTopics: topics }));
  }, []);

  const handleSubTopicChange = useCallback((subTopics: string[]) => {
    setFilterState(prev => ({ ...prev, selectedSubTopics: subTopics }));
  }, []);

  const handleImportanceChange = useCallback((min: number, max: number) => {
    setFilterState(prev => ({ 
      ...prev, 
      minImportance: min, 
      maxImportance: max 
    }));
  }, []);

  const handleFilterChange = useCallback((newState: FilterState) => {
    setFilterState(newState);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterState(initialFilterState);
  }, [initialFilterState]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced Search
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Search and filter articles with multiple criteria
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

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearchChange}
          placeholder="Search articles by title, content, or tags..."
          initialValue={filterState.searchQuery}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filter Manager */}
          <FilterManager
            articles={allArticles}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Date Filter */}
          <DateFilter
            onDateRangeChange={handleDateRangeChange}
          />

          {/* Topic Filter */}
          <TopicFilter
            selectedTopics={filterState.selectedTopics}
            selectedSubTopics={filterState.selectedSubTopics}
            onTopicChange={handleTopicChange}
            onSubTopicChange={handleSubTopicChange}
          />

          {/* Importance Filter */}
          <ImportanceFilter
            minImportance={filterState.minImportance}
            maxImportance={filterState.maxImportance}
            onImportanceChange={handleImportanceChange}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </span>
                {filteredArticles.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {Math.min(filteredArticles.length, 20)} of {filteredArticles.length}
                  </span>
                )}
              </div>
            </div>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.slice(0, 20).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    hasNotes={articlesWithNotes.includes(article.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  No articles match your search criteria
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredArticles.length > 20 && (
              <div className="mt-8 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage; 