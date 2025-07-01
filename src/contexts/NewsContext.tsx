import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NewsArticle, ArticleFilters, ArticleSearchParams } from '../types';

interface NewsContextType {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  filters: ArticleFilters;
  searchParams: ArticleSearchParams;
  setFilters: (filters: ArticleFilters) => void;
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
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filters, setFiltersState] = useState<ArticleFilters>({});
  const [searchParams, setSearchParamsState] = useState<ArticleSearchParams>({
    query: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter articles based on current filters and search params
  const filteredArticles = React.useMemo(() => {
    let filtered = [...articles];

    // Apply search query
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
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

    if (filters.subTopic) {
      filtered = filtered.filter(article => article.subTopic === filters.subTopic);
    }

    if (filters.importance) {
      filtered = filtered.filter(article => article.importance === filters.importance);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(article =>
        filters.tags!.some(tag => article.tags.includes(tag))
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter(article =>
        article.date >= filters.dateRange!.start && article.date <= filters.dateRange!.end
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (searchParams.sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'importance':
          comparison = b.importance - a.importance;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = a.date.getTime() - b.date.getTime();
      }

      return searchParams.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [articles, filters, searchParams]);

  const setFilters = useCallback((newFilters: ArticleFilters) => {
    setFiltersState(newFilters);
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
    searchParams,
    setFilters,
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