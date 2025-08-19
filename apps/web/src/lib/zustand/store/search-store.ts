import { create } from 'zustand';

export interface SearchState {
  query: string;
  isSearching: boolean;
  showResults: boolean;
  setQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setShowResults: (showResults: boolean) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isSearching: false,
  showResults: false,
  setQuery: (query) => set({ query }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setShowResults: (showResults) => set({ showResults }),
  clearSearch: () => set({ query: '', isSearching: false, showResults: false }),
}));
