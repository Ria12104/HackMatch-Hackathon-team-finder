'use client';

// Minimal shared state: auth + matches.
// navigate() is handled directly in each screen via useRouter().

import { createContext, useContext, useState } from 'react';
import type { Match } from '@/types';
import { initMatches } from '@/constants/mockData';

interface AppState {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  matches: Match[];
  setMatches: (m: Match[]) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [matches, setMatches] = useState<Match[]>(initMatches);
  return (
    <AppStateContext.Provider value={{ isAuthenticated, setIsAuthenticated, matches, setMatches }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within <AppProvider>');
  return ctx;
}
