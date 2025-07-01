import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'detailed' | 'prelims' | 'mains' | 'one-liner';
export type LayoutMode = 'card' | 'list' | 'table';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: React.ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>('detailed');
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('card');

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('preferred-view-mode') as ViewMode;
    const savedLayout = localStorage.getItem('preferred-layout-mode') as LayoutMode;
    
    if (savedMode) {
      setViewModeState(savedMode);
    }
    if (savedLayout) {
      setLayoutModeState(savedLayout);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('preferred-view-mode', mode);
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem('preferred-layout-mode', mode);
  };

  const value: ViewModeContextType = {
    viewMode,
    setViewMode,
    layoutMode,
    setLayoutMode
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}; 