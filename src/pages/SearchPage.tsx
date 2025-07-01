import React, { useState, useMemo } from 'react';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import DateFilter from '../components/UI/DateFilter';
import { ArticleFilters, DateRange } from '../types';
import { loadSampleArticles } from '../utils/sampleData';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ArticleFilters>({});
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // Get all articles from sample data
  const allArticles = loadSampleArticles();

  // Demo: Some articles have notes (for demonstration purposes)
  const articlesWithNotes = ['1', '3', '7', '10', '15', '20', '25', '28']; // Article IDs that have notes

  // Filter articles based on search query and filters
  const searchResults = useMemo(() => {
    let filtered = [...allArticles];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.oneLiner.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.topic) {
      filtered = filtered.filter(article => article.topic === filters.topic);
    }

    if (filters.importance) {
      filtered = filtered.filter(article => article.importance === filters.importance);
    }

    // Apply date range filter
    if (dateRange) {
      filtered = filtered.filter(article => 
        article.date >= dateRange.start && article.date <= dateRange.end
      );
    }

    return filtered;
  }, [allArticles, searchQuery, filters, dateRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo above
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setDateRange(null);
  };

  const handleDateRangeChange = (range: DateRange | null) => {
    setDateRange(range);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find articles by keywords, topics, or filters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filters
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter keywords..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <select
                  value={filters.topic || ''}
                  onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Topics</option>
                  <option value="Economy">Economy</option>
                  <option value="Science & Tech">Science & Tech</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Importance Level
                </label>
                <select
                  value={filters.importance || ''}
                  onChange={(e) => setFilters({ ...filters, importance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="5">Level 5 (Critical)</option>
                  <option value="4">Level 4 (High)</option>
                  <option value="3">Level 3 (Medium)</option>
                  <option value="2">Level 2 (Low)</option>
                  <option value="1">Level 1 (Minimal)</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Date Filter */}
          <DateFilter onDateRangeChange={handleDateRangeChange} />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {searchResults.length} article{searchResults.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    hasNotes={articlesWithNotes.includes(article.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No articles found. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 