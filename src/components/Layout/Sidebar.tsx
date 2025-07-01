import React, { useState, useMemo, useCallback } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { loadSampleArticles, getArticlesByTopic, getArticlesByImportance } from '../../utils/sampleData';
import SearchBar from '../UI/SearchBar';
import DateFilter from '../UI/DateFilter';
import TopicFilter from '../UI/TopicFilter';
import ImportanceFilter from '../UI/ImportanceFilter';
import FilterManager from '../UI/FilterManager';

interface FilterState {
  searchQuery: string;
  dateRange: { start: Date | null; end: Date | null };
  selectedTopics: string[];
  selectedSubTopics: string[];
  minImportance: number;
  maxImportance: number;
}

const Sidebar: React.FC = () => {
  const { filterState, setFilterState, clearFilters } = useNews();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Get real data counts
  const allArticles = loadSampleArticles();
  const totalArticles = allArticles.length;
  
  // Get counts by topic
  const topicCounts = {
    'Economy': getArticlesByTopic('Economy').length,
    'Science & Tech': getArticlesByTopic('Science & Tech').length,
    'National': getArticlesByTopic('National').length,
    'International': getArticlesByTopic('International').length,
    'Environment': getArticlesByTopic('Environment').length,
  };

  // Get counts by importance
  const importanceCounts = {
    5: getArticlesByImportance(5).length,
    4: getArticlesByImportance(4).length,
    3: getArticlesByImportance(3).length,
    2: getArticlesByImportance(2).length,
    1: getArticlesByImportance(1).length,
  };

  // Filter articles based on current filter state
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      // Search filter
      if (filterState.searchQuery) {
        const searchLower = filterState.searchQuery.toLowerCase();
        const matchesSearch = 
          article.title.toLowerCase().includes(searchLower) ||
          article.content.detailed.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
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
    setFilterState({ ...filterState, searchQuery: query });
  }, [filterState, setFilterState]);

  const handleDateRangeChange = useCallback((dateRange: { start: Date; end: Date; } | null) => {
    setFilterState({ 
      ...filterState, 
      dateRange: { 
        start: dateRange?.start || null, 
        end: dateRange?.end || null 
      } 
    });
  }, [filterState, setFilterState]);

  const handleTopicChange = useCallback((topics: string[]) => {
    setFilterState({ ...filterState, selectedTopics: topics });
  }, [filterState, setFilterState]);

  const handleSubTopicChange = useCallback((subTopics: string[]) => {
    setFilterState({ ...filterState, selectedSubTopics: subTopics });
  }, [filterState, setFilterState]);

  const handleImportanceChange = useCallback((min: number, max: number) => {
    setFilterState({ 
      ...filterState, 
      minImportance: min, 
      maxImportance: max 
    });
  }, [filterState, setFilterState]);

  const handleFilterChange = useCallback((newState: FilterState) => {
    setFilterState(newState);
  }, [setFilterState]);

  const handleResetFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.searchQuery) count++;
    if (filterState.dateRange.start || filterState.dateRange.end) count++;
    if (filterState.selectedTopics.length > 0) count++;
    if (filterState.selectedSubTopics.length > 0) count++;
    if (filterState.minImportance > 1 || filterState.maxImportance < 5) count++;
    return count;
  }, [filterState]);

  // Get articles with notes
  const articlesWithNotes = useMemo(() => {
    return allArticles.filter(article => {
      const savedNotes = localStorage.getItem(`article-notes-${article.id}`);
      return savedNotes && JSON.parse(savedNotes).length > 0;
    }).map(article => article.id);
  }, [allArticles]);

  const topics = [
    { name: 'Economy', count: topicCounts['Economy'], icon: '💰' },
    { name: 'Science & Tech', count: topicCounts['Science & Tech'], icon: '💻' },
    { name: 'National', count: topicCounts['National'], icon: '🏛️' },
    { name: 'International', count: topicCounts['International'], icon: '🌍' },
    { name: 'Environment', count: topicCounts['Environment'], icon: '🌱' },
  ];

  const importanceLevels = [
    { level: 5, label: 'Critical', color: 'bg-red-500', count: importanceCounts[5] },
    { level: 4, label: 'High', color: 'bg-orange-500', count: importanceCounts[4] },
    { level: 3, label: 'Medium', color: 'bg-yellow-500', count: importanceCounts[3] },
    { level: 2, label: 'Low', color: 'bg-blue-500', count: importanceCounts[2] },
    { level: 1, label: 'Minimal', color: 'bg-gray-500', count: importanceCounts[1] },
  ];

  // Calculate this week's articles (articles from last 7 days)
  const thisWeekArticles = allArticles.filter(article => {
    const articleDate = new Date(article.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return articleDate >= weekAgo;
  });

  const handleTopicClick = (topicName: string) => {
    setFilterState({ ...filterState, selectedTopics: [topicName] });
  };

  const handleImportanceClick = (level: number) => {
    setFilterState({ ...filterState, minImportance: level, maxImportance: level });
  };

  const isTopicActive = (topicName: string) => {
    return filterState.selectedTopics.includes(topicName);
  };

  const isImportanceActive = (level: number) => {
    return filterState.minImportance === level && filterState.maxImportance === level;
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Filters & Tools</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {filteredArticles.length} of {totalArticles} articles
          </p>
          
          {/* Quick Notes Access */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Notes: {articlesWithNotes.length} articles
                </span>
              </div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition-colors duration-200"
              >
                {showNotes ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearchChange}
            placeholder="Search articles..."
            initialValue={filterState.searchQuery}
          />
        </div>

        {/* Quick Filters Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Advanced Filters
            </span>
            <div className="flex items-center space-x-2">
              {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                  showAdvancedFilters ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mb-6 space-y-4">
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
        )}

        {/* Quick Topic Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Topics</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <button
                key={topic.name}
                onClick={() => handleTopicClick(topic.name)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors duration-200 ${
                  isTopicActive(topic.name)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{topic.icon}</span>
                <span className="truncate">{topic.name}</span>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
                  {topic.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Importance Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Importance</h3>
          <div className="space-y-1">
            {importanceLevels.map((item) => (
              <button
                key={item.level}
                onClick={() => handleImportanceClick(item.level)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isImportanceActive(item.level)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.color} mr-2`}></span>
                <span className="flex-1 text-left">{item.label}</span>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notes</h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {showNotes ? 'Hide' : 'Show'}
            </button>
          </div>
          {showNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Articles with Notes: {articlesWithNotes.length}
                </span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                Click on any article to add notes in the modal view
              </p>
              
              {/* Quick Notes Guide */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-yellow-200 dark:border-yellow-600">
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Click any article card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Click pencil icon in modal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Type note & press Ctrl+Enter</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Articles</span>
              <span className="font-medium text-gray-900 dark:text-white">{totalArticles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">This Week</span>
              <span className="font-medium text-gray-900 dark:text-white">{thisWeekArticles.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Critical</span>
              <span className="font-medium text-red-600 dark:text-red-400">{importanceCounts[5]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">With Notes</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{articlesWithNotes.length}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 