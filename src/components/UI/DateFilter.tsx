import React, { useState, useEffect } from 'react';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

interface DateFilterProps {
  onDateRangeChange: (dateRange: { start: Date; end: Date } | null) => void;
  className?: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

const DateFilter: React.FC<DateFilterProps> = ({ onDateRangeChange, className = '' }) => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Get min and max dates from sample data (last 3 months)
  const minDate = subMonths(new Date(), 3);
  const maxDate = new Date();
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate slider values
  const getSliderValue = (date: Date): number => {
    const daysDiff = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(100, (daysDiff / totalDays) * 100));
  };

  const getDateFromSliderValue = (value: number): Date => {
    const daysDiff = (value / 100) * totalDays;
    return new Date(minDate.getTime() + daysDiff * 24 * 60 * 60 * 1000);
  };

  // Preset date ranges
  const presetRanges = [
    {
      label: 'Last 7 days',
      range: {
        start: startOfDay(subDays(new Date(), 7)),
        end: endOfDay(new Date())
      }
    },
    {
      label: 'Last 30 days',
      range: {
        start: startOfDay(subDays(new Date(), 30)),
        end: endOfDay(new Date())
      }
    },
    {
      label: 'Last 3 months',
      range: {
        start: startOfDay(subMonths(new Date(), 3)),
        end: endOfDay(new Date())
      }
    },
    {
      label: 'All time',
      range: {
        start: startOfDay(minDate),
        end: endOfDay(maxDate)
      }
    }
  ];

  // Handle preset button click
  const handlePresetClick = (range: DateRange) => {
    setDateRange(range);
    setIsCustomMode(false);
    setStartDate(format(range.start, 'yyyy-MM-dd'));
    setEndDate(format(range.end, 'yyyy-MM-dd'));
    onDateRangeChange(range);
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const date = getDateFromSliderValue(value);
    const range = {
      start: startOfDay(date),
      end: endOfDay(date)
    };
    setDateRange(range);
    setIsCustomMode(false);
    setStartDate(format(range.start, 'yyyy-MM-dd'));
    setEndDate(format(range.end, 'yyyy-MM-dd'));
    onDateRangeChange(range);
  };

  // Reset filter
  const handleReset = () => {
    setDateRange(null);
    setIsCustomMode(false);
    setStartDate('');
    setEndDate('');
    onDateRangeChange(null);
  };

  // Update custom date inputs when date range changes
  useEffect(() => {
    if (dateRange) {
      setStartDate(format(dateRange.start, 'yyyy-MM-dd'));
      setEndDate(format(dateRange.end, 'yyyy-MM-dd'));
    }
  }, [dateRange]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Date Filter
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      {/* Date Range Display */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {dateRange ? (
                <>
                  {format(dateRange.start, 'MMM dd, yyyy')} - {format(dateRange.end, 'MMM dd, yyyy')}
                </>
              ) : (
                'All dates'
              )}
            </span>
          </div>
          {dateRange && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} days
            </span>
          )}
        </div>
      </div>

      {/* Date Range Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Date Selection
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={dateRange ? getSliderValue(dateRange.start) : 0}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{format(minDate, 'MMM dd')}</span>
            <span>{format(maxDate, 'MMM dd')}</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.range)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                dateRange &&
                dateRange.start.getTime() === preset.range.start.getTime() &&
                dateRange.end.getTime() === preset.range.end.getTime()
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Custom Date Range
          </label>
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            {isCustomMode ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {isCustomMode && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value && endDate) {
                    const start = new Date(e.target.value);
                    const end = new Date(endDate);
                    if (start <= end) {
                      const range = {
                        start: startOfDay(start),
                        end: endOfDay(end)
                      };
                      setDateRange(range);
                      onDateRangeChange(range);
                    }
                  }
                }}
                min={format(minDate, 'yyyy-MM-dd')}
                max={format(maxDate, 'yyyy-MM-dd')}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (startDate && e.target.value) {
                    const start = new Date(startDate);
                    const end = new Date(e.target.value);
                    if (start <= end) {
                      const range = {
                        start: startOfDay(start),
                        end: endOfDay(end)
                      };
                      setDateRange(range);
                      onDateRangeChange(range);
                    }
                  }
                }}
                min={format(minDate, 'yyyy-MM-dd')}
                max={format(maxDate, 'yyyy-MM-dd')}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Indicator */}
      {dateRange && (
        <div className="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Filtering articles from {format(dateRange.start, 'MMM dd, yyyy')} to {format(dateRange.end, 'MMM dd, yyyy')}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateFilter; 