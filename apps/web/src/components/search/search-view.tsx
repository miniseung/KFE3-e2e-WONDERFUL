'use client';

import { useSearchStore } from '@/lib/zustand/store/search-store';

import { SearchLog } from './search-log';
import SearchResult from './search-result';

const SearchView = () => {
  const { showResults } = useSearchStore();

  return showResults ? <SearchResult /> : <SearchLog />;
};

export default SearchView;
