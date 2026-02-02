import { createContext, useContext, ReactNode } from 'react';
import { useAutoAnnotate } from './useAutoAnnotate';

const AutoAnnotateContext = createContext<ReturnType<typeof useAutoAnnotate> | null>(null);

interface AutoAnnotateProviderProps {
  children: ReactNode;
}

export function AutoAnnotateProvider({ children }: AutoAnnotateProviderProps) {
  const autoAnnotate = useAutoAnnotate();

  return (
    <AutoAnnotateContext.Provider value={autoAnnotate}>
      {children}
    </AutoAnnotateContext.Provider>
  );
}

export function useAutoAnnotateContext() {
  const context = useContext(AutoAnnotateContext);
  if (!context) {
    throw new Error('useAutoAnnotateContext must be used within AutoAnnotateProvider');
  }
  return context;
}