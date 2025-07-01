import React, { useState } from 'react';
import { getArticlesByImportance } from '../../utils/sampleData';

interface ImportanceFilterProps {
  minImportance: number;
  maxImportance: number;
  onImportanceChange: (min: number, max: number) => void;
  className?: string;
}

interface ImportanceLevel {
  level: number;
  label: string;
  color: string;
  count: number;
}

const ImportanceFilter: React.FC<ImportanceFilterProps> = ({
  minImportance,
  maxImportance,
  onImportanceChange,
  className = ''
}) => {
  const [localMin, setLocalMin] = useState(minImportance);
  const [localMax, setLocalMax] = useState(maxImportance);

  // Get importance level data with counts
  const importanceLevels: ImportanceLevel[] = [
    { level: 5, label: 'Critical', color: 'bg-red-500', count: getArticlesByImportance(5).length },
    { level: 4, label: 'High', color: 'bg-orange-500', count: getArticlesByImportance(4).length },
    { level: 3, label: 'Medium', color: 'bg-yellow-500', count: getArticlesByImportance(3).length },
    { level: 2, label: 'Low', color: 'bg-blue-500', count: getArticlesByImportance(2).length },
    { level: 1, label: 'Minimal', color: 'bg-gray-500', count: getArticlesByImportance(1).length },
  ];

  // Quick preset ranges
  const presetRanges = [
    { label: 'High Priority', min: 4, max: 5, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700' },
    { label: 'Medium', min: 2, max: 3, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700' },
    { label: 'All', min: 1, max: 5, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600' },
  ];

  // Handle range slider changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    const newMax = Math.max(newMin, localMax);
    setLocalMin(newMin);
    setLocalMax(newMax);
    onImportanceChange(newMin, newMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    const newMin = Math.min(localMin, newMax);
    setLocalMin(newMin);
    setLocalMax(newMax);
    onImportanceChange(newMin, newMax);
  };

  // Handle preset button clicks
  const handlePresetClick = (min: number, max: number) => {
    setLocalMin(min);
    setLocalMax(max);
    onImportanceChange(min, max);
  };

  // Reset to show all importance levels
  const handleReset = () => {
    setLocalMin(1);
    setLocalMax(5);
    onImportanceChange(1, 5);
  };

  // Star rating component
  const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ rating, maxRating = 5 }) => {
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

  // Get importance level label
  const getImportanceLabel = (level: number) => {
    const importanceLevel = importanceLevels.find(il => il.level === level);
    return importanceLevel ? importanceLevel.label : `Level ${level}`;
  };

  // Calculate total articles in current range
  const getTotalInRange = () => {
    return importanceLevels
      .filter(il => il.level >= localMin && il.level <= localMax)
      .reduce((sum, il) => sum + il.count, 0);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Importance Filter
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      {/* Current Range Display */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {localMin === localMax 
                ? `${getImportanceLabel(localMin)} (${localMin}/5)`
                : `${getImportanceLabel(localMin)} - ${getImportanceLabel(localMax)} (${localMin}-${localMax}/5)`
              }
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getTotalInRange()} articles
          </span>
        </div>
        <StarRating rating={localMax} />
      </div>

      {/* Range Sliders */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Importance
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={localMin}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1 (Minimal)</span>
            <span>5 (Critical)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Importance
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={localMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1 (Minimal)</span>
            <span>5 (Critical)</span>
          </div>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-1 gap-2">
          {presetRanges.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.min, preset.max)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 border ${
                localMin === preset.min && localMax === preset.max
                  ? preset.color
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Importance Level Breakdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Importance Levels
        </label>
        <div className="space-y-2">
          {importanceLevels.map((level) => (
            <div
              key={level.level}
              className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 ${
                level.level >= localMin && level.level <= localMax
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${level.color}`}></span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {level.label}
                </span>
                <StarRating rating={level.level} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {level.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(localMin > 1 || localMax < 5) && (
        <div className="mt-6 flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Filtering articles with importance {localMin}-{localMax}/5 ({getTotalInRange()} articles)
          </span>
        </div>
      )}
    </div>
  );
};

export default ImportanceFilter; 