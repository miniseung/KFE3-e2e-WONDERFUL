'use client';

import { AlarmClock, X } from 'lucide-react';

import { useSearchHistory } from '@/hooks/common/useSearchHistory';

import { useSearchStore } from '@/lib/zustand/store/search-store';

export const SearchLog = () => {
  const { history, removeSearchQuery, clearAllHistory, addSearchQuery } = useSearchHistory();
  const { setQuery, setShowResults } = useSearchStore();

  const handleDelete = (id: string) => {
    removeSearchQuery(id);
  };

  const handleClearAll = () => {
    clearAllHistory();
  };

  const handleSearchItemClick = (query: string) => {
    addSearchQuery(query);
    setQuery(query);
    setShowResults(true);
  };

  return (
    <div className="flex w-full flex-col gap-4 px-2 py-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-neutral-900">최근 검색어</p>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            전체 삭제
          </button>
        )}
      </div>

      <div>
        {history.length === 0 ? (
          <p className="font-regular flex justify-center py-8 text-neutral-600">
            최근 검색어가 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="flex w-full items-center justify-between py-2">
                <button
                  type="button"
                  onClick={() => handleSearchItemClick(item.query)}
                  className="-mx-2 flex flex-1 items-center gap-2 rounded px-2 py-1 text-left hover:bg-neutral-50"
                >
                  <AlarmClock className="text-neutral-500" strokeWidth={2.5} size={20} />
                  <span className="text-neutral-900">{item.query}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="ml-2 flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-neutral-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
