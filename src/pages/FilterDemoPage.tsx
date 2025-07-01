import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import TopicFilter from '../components/UI/TopicFilter';
import ImportanceFilter from '../components/UI/ImportanceFilter';
import { loadSampleArticles } from '../utils/sampleData';

const FilterDemoPage: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [minImportance, setMinImportance] = useState(1);
  const [maxImportance, setMaxImportance] = useState(5);
  const allArticles = loadSampleArticles();

  // Demo: Some articles have notes (for demonstration purposes)
  const articlesWithNotes = ['1', '3', '7', '10', '15', '20', '25', '28'];

  // Filter articles based on selected filters
  const filteredArticles = useMemo(() => {
    let filtered = [...allArticles];

    // Filter by topics
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(article => selectedTopics.includes(article.topic));
    }

    // Filter by sub-topics
    if (selectedSubTopics.length > 0) {
      filtered = filtered.filter(article => selectedSubTopics.includes(article.subTopic));
    }

    // Filter by importance range
    filtered = filtered.filter(article => 
      article.importance >= minImportance && article.importance <= maxImportance
    );

    return filtered;
  }, [allArticles, selectedTopics, selectedSubTopics, minImportance, maxImportance]);

  const handleTopicChange = (topics: string[]) => {
    setSelectedTopics(topics);
  };

  const handleSubTopicChange = (subTopics: string[]) => {
    setSelectedSubTopics(subTopics);
  };

  const handleImportanceChange = (min: number, max: number) => {
    setMinImportance(min);
    setMaxImportance(max);
  };

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setSelectedSubTopics([]);
    setMinImportance(1);
    setMaxImportance(5);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Filter Components Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the TopicFilter and ImportanceFilter components with sample articles
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Clear All Button */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={clearAllFilters}
              className="w-full bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>

          {/* Topic Filter */}
          <TopicFilter
            selectedTopics={selectedTopics}
            selectedSubTopics={selectedSubTopics}
            onTopicChange={handleTopicChange}
            onSubTopicChange={handleSubTopicChange}
          />

          {/* Importance Filter */}
          <ImportanceFilter
            minImportance={minImportance}
            maxImportance={maxImportance}
            onImportanceChange={handleImportanceChange}
          />

          {/* Filter Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Articles</span>
                <span className="font-medium text-gray-900 dark:text-white">{allArticles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Filtered Articles</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{filteredArticles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Selected Topics</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedTopics.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Selected Sub-topics</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedSubTopics.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Importance Range</span>
                <span className="font-medium text-gray-900 dark:text-white">{minImportance}-{maxImportance}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtered Results */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filtered Articles
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  No articles match the current filters
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Try adjusting your filter criteria or clear all filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDemoPage; 