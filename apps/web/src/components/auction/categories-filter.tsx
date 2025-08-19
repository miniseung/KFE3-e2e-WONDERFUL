'use client';

import { FilterTab } from '@/components/common';

import { useCategories } from '@/hooks/queries/category/useCategories';

import { TabItem } from '@/types/filter';

const CategoriesFilter = () => {
  const { data: categoriesData, isLoading } = useCategories();

  if (isLoading || !categoriesData) {
    return (
      <div className="mb-3 mt-2 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-89 h-[35px] animate-pulse rounded-md bg-neutral-200" />
        ))}
      </div>
    ); // 로딩 상태에서의 스켈레톤 UI
  }

  const updateCategories: TabItem[] = [{ id: '', name: '전체' }];
  categoriesData.data.forEach((item) => {
    updateCategories.push(item);
  });

  return <FilterTab filterKey="category" items={updateCategories} className="mt-2" />;
};

export default CategoriesFilter;
