'use client';

import { useCallback, useEffect, useState } from 'react';

import { X, Search } from 'lucide-react';

import { useSearchHistory } from '@/hooks/common/useSearchHistory';

import { useSearchStore } from '@/lib/zustand/store/search-store';

const InputSearch = () => {
  const { addSearchQuery } = useSearchHistory();
  const { query, setQuery, setShowResults, clearSearch } = useSearchStore();
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleClear = useCallback(() => {
    setValue('');
    clearSearch();
  }, [clearSearch]);

  const performSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      addSearchQuery(trimmedQuery);
      setQuery(trimmedQuery);
      setShowResults(true);
    },
    [addSearchQuery, setQuery, setShowResults]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      performSearch(value);
    },
    [value, performSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b-1 flex h-[80%] w-full items-center gap-2 border-neutral-800 px-1 text-neutral-800 [&_input]:h-[60%]"
    >
      <Search size={24} className="shirkin" />
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-neutral-800 text-white"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default InputSearch;
