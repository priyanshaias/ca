export interface NewsArticle {
  id: string;
  title: string;
  date: Date;
  topic: string;
  subTopic: string;
  importance: 1 | 2 | 3 | 4 | 5;
  content: {
    detailed: string;
    prelims: string;
    mains: string;
    oneLiner: string;
  };
  tags: string[];
  source: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ArticleFilters {
  topic?: string;
  subTopic?: string;
  topics?: string[];
  subTopics?: string[];
  importance?: number;
  minImportance?: number;
  maxImportance?: number;
  dateRange?: DateRange;
  tags?: string[];
}

export interface ArticleSearchParams {
  query: string;
  filters?: ArticleFilters;
  sortBy?: 'date' | 'importance' | 'title';
  sortOrder?: 'asc' | 'desc';
} 