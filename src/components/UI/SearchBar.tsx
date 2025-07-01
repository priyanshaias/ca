import React, { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search articles by title, content, or tags...",
  className = '',
  debounceMs = 300,
  initialValue = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  // Debounce the search query
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [searchQuery, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    onSearch('');
  }, [onSearch]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    onSearch(searchQuery);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 ${
                isLoading 
                  ? 'text-blue-500 animate-spin' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isLoading ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              )}
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
          />

          {/* Clear Button */}
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Search Status Indicator */}
      {searchQuery && (
        <div className="mt-2 flex items-center space-x-2 text-sm">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Searching...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Searching for "{searchQuery}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 