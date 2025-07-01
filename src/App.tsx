import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NewsProvider } from './contexts/NewsContext';
import { ViewModeProvider } from './contexts/ViewModeContext';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const TopicsPage = lazy(() => import('./pages/TopicsPage'));

// Loading component for lazy-loaded routes
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// Error fallback component
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Something went wrong</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ThemeProvider>
        <NewsProvider>
          <ViewModeProvider>
            <Router>
              <div className="App">
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Main routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/article/:id" element={<ArticleDetailPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/topics" element={<TopicsPage />} />
                      <Route path="/topics/:topic" element={<TopicsPage />} />
                      
                      {/* Catch all route - redirect to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </div>
            </Router>
          </ViewModeProvider>
        </NewsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 