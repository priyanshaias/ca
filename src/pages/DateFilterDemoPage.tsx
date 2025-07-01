import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import DateFilter from '../components/UI/DateFilter';
import { DateRange } from '../types';
import { loadSampleArticles } from '../utils/sampleData';

const DateFilterDemoPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const allArticles = loadSampleArticles();

  // Demo: Some articles have notes (for demonstration purposes)
  const articlesWithNotes = ['1', '3', '7', '10', '15', '20', '25', '28'];

  // Filter articles by date range
  const filteredArticles = useMemo(() => {
    if (!dateRange) return allArticles;
    
    return allArticles.filter(article => 
      article.date >= dateRange.start && article.date <= dateRange.end
    );
  }, [allArticles, dateRange]);

  const handleDateRangeChange = (range: DateRange | null) => {
    setDateRange(range);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Date Filter Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the date filter functionality with sample articles
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
        {/* Date Filter */}
        <div className="lg:col-span-1">
          <DateFilter onDateRangeChange={handleDateRangeChange} />
          
          {/* Filter Stats */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                <span className="text-gray-600 dark:text-gray-400">Date Range</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {dateRange ? 'Active' : 'All dates'}
                </span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  No articles found in the selected date range
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Try adjusting the date filter or select a different range
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateFilterDemoPage; 