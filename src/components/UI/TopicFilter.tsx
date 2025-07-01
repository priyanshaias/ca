import React, { useState } from 'react';
import { getArticlesByTopic } from '../../utils/sampleData';

interface TopicFilterProps {
  selectedTopics: string[];
  selectedSubTopics: string[];
  onTopicChange: (topics: string[]) => void;
  onSubTopicChange: (subTopics: string[]) => void;
  className?: string;
}

interface TopicData {
  name: string;
  subTopics: string[];
  count: number;
  icon: string;
}

const TopicFilter: React.FC<TopicFilterProps> = ({
  selectedTopics,
  selectedSubTopics,
  onTopicChange,
  onSubTopicChange,
  className = ''
}) => {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  // Define topics with their sub-topics and icons
  const topicsData: TopicData[] = [
    {
      name: 'Economy',
      subTopics: ['Monetary Policy', 'Taxation', 'Growth', 'Trade', 'Employment', 'Digital Currency'],
      count: getArticlesByTopic('Economy').length,
      icon: '💰'
    },
    {
      name: 'Science & Tech',
      subTopics: ['Space', 'Innovation', 'Telecom', 'Transport', 'Entrepreneurship'],
      count: getArticlesByTopic('Science & Tech').length,
      icon: '💻'
    },
    {
      name: 'National',
      subTopics: ['Judiciary', 'Defence', 'Health', 'Education'],
      count: getArticlesByTopic('National').length,
      icon: '🏛️'
    },
    {
      name: 'International',
      subTopics: ['Trade', 'Defence', 'Energy', 'Diplomacy'],
      count: getArticlesByTopic('International').length,
      icon: '🌍'
    },
    {
      name: 'Environment',
      subTopics: ['Weather', 'Air Quality', 'Wildlife', 'Renewable Energy', 'Energy'],
      count: getArticlesByTopic('Environment').length,
      icon: '🌱'
    }
  ];

  // Handle topic selection/deselection
  const handleTopicChange = (topicName: string, checked: boolean) => {
    if (checked) {
      const newTopics = [...selectedTopics, topicName];
      onTopicChange(newTopics);
      
      // Add sub-topics of the selected topic
      const topicData = topicsData.find(t => t.name === topicName);
      if (topicData) {
        const newSubTopics = [...selectedSubTopics, ...topicData.subTopics];
        onSubTopicChange(newSubTopics.filter((item, index, arr) => arr.indexOf(item) === index)); // Remove duplicates
      }
    } else {
      const newTopics = selectedTopics.filter(t => t !== topicName);
      onTopicChange(newTopics);
      
      // Remove sub-topics of the deselected topic
      const topicData = topicsData.find(t => t.name === topicName);
      if (topicData) {
        const newSubTopics = selectedSubTopics.filter(st => !topicData.subTopics.includes(st));
        onSubTopicChange(newSubTopics);
      }
    }
  };

  // Handle sub-topic selection/deselection
  const handleSubTopicChange = (subTopic: string, checked: boolean) => {
    if (checked) {
      onSubTopicChange([...selectedSubTopics, subTopic]);
    } else {
      onSubTopicChange(selectedSubTopics.filter(st => st !== subTopic));
    }
  };

  // Select all topics
  const handleSelectAll = () => {
    const allTopics = topicsData.map(t => t.name);
    const allSubTopics = topicsData.flatMap(t => t.subTopics);
    onTopicChange(allTopics);
    onSubTopicChange(allSubTopics);
    setExpandedTopics(allTopics);
  };

  // Clear all topics
  const handleClearAll = () => {
    onTopicChange([]);
    onSubTopicChange([]);
    setExpandedTopics([]);
  };

  // Toggle topic expansion
  const toggleTopicExpansion = (topicName: string) => {
    if (expandedTopics.includes(topicName)) {
      setExpandedTopics(expandedTopics.filter(t => t !== topicName));
    } else {
      setExpandedTopics([...expandedTopics, topicName]);
    }
  };

  // Check if all sub-topics of a topic are selected
  // const areAllSubTopicsSelected = (topicName: string) => {
  //   const topicData = topicsData.find(t => t.name === topicName);
  //   if (!topicData) return false;
  //   return topicData.subTopics.every(st => selectedSubTopics.includes(st));
  // };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Topic Filter
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {topicsData.map((topic) => (
          <div key={topic.name} className="border border-gray-200 dark:border-gray-600 rounded-lg">
            {/* Main Topic */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`topic-${topic.name}`}
                  checked={selectedTopics.includes(topic.name)}
                  onChange={(e) => handleTopicChange(topic.name, e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`topic-${topic.name}`}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                >
                  <span className="text-base">{topic.icon}</span>
                  <span>{topic.name}</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {topic.count}
                </span>
                <button
                  onClick={() => toggleTopicExpansion(topic.name)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      expandedTopics.includes(topic.name) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sub-topics */}
            {expandedTopics.includes(topic.name) && (
              <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-3 space-y-2">
                {topic.subTopics.map((subTopic) => (
                  <div key={subTopic} className="flex items-center space-x-3 ml-6">
                    <input
                      type="checkbox"
                      id={`subtopic-${subTopic}`}
                      checked={selectedSubTopics.includes(subTopic)}
                      onChange={(e) => handleSubTopicChange(subTopic, e.target.checked)}
                      className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`subtopic-${subTopic}`}
                      className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {subTopic}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {(selectedTopics.length > 0 || selectedSubTopics.length > 0) && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Active Filters
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {selectedTopics.length > 0 && (
              <div>
                <strong>Topics:</strong> {selectedTopics.join(', ')}
              </div>
            )}
            {selectedSubTopics.length > 0 && (
              <div>
                <strong>Sub-topics:</strong> {selectedSubTopics.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicFilter; 