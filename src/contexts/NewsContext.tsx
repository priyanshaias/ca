import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { NewsArticle, ArticleFilters, ArticleSearchParams } from '../types';
import { loadSampleArticles } from '../utils/sampleData';

interface FilterState {
  searchQuery: string;
  dateRange: { start: Date | null; end: Date | null };
  selectedTopics: string[];
  selectedSubTopics: string[];
  minImportance: number;
  maxImportance: number;
}

interface NewsContextType {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  filters: ArticleFilters;
  filterState: FilterState;
  searchParams: ArticleSearchParams;
  setFilters: (filters: ArticleFilters) => void;
  setFilterState: (filterState: FilterState) => void;
  setSearchParams: (params: ArticleSearchParams) => void;
  addArticle: (article: NewsArticle) => void;
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  clearFilters: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(loadSampleArticles());
  const [filters, setFiltersState] = useState<ArticleFilters>({});
  const [filterState, setFilterStateState] = useState<FilterState>({
    searchQuery: '',
    dateRange: { start: null, end: null },
    selectedTopics: [],
    selectedSubTopics: [],
    minImportance: 1,
    maxImportance: 5
  });
  const [searchParams, setSearchParamsState] = useState<ArticleSearchParams>({
    query: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter articles based on current filter state
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
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
  }, [articles, filterState]);

  const setFilters = useCallback((newFilters: ArticleFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setFilterState = useCallback((newFilterState: FilterState) => {
    setFilterStateState(newFilterState);
  }, []);

  const setSearchParams = useCallback((newParams: ArticleSearchParams) => {
    setSearchParamsState(newParams);
  }, []);

  const addArticle = useCallback((article: NewsArticle) => {
    setArticles(prev => [...prev, article]);
  }, []);

  const updateArticle = useCallback((id: string, updates: Partial<NewsArticle>) => {
    setArticles(prev => prev.map(article =>
      article.id === id ? { ...article, ...updates } : article
    ));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setFilterStateState({
      searchQuery: '',
      dateRange: { start: null, end: null },
      selectedTopics: [],
      selectedSubTopics: [],
      minImportance: 1,
      maxImportance: 5
    });
    setSearchParamsState({
      query: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  }, []);

  const value: NewsContextType = {
    articles,
    filteredArticles,
    filters,
    filterState,
    searchParams,
    setFilters,
    setFilterState,
    setSearchParams,
    addArticle,
    updateArticle,
    deleteArticle,
    clearFilters,
    isLoading,
    setIsLoading
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}; 