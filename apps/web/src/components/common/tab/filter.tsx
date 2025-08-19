'use client';

import { FilterTabs, FilterTabsList, FilterTabsTrigger } from '@/components/ui/tab-filter';

import useFilterChange from '@/hooks/common/useFilterItem';

import { cn } from '@/lib/cn';
import { FilterTabProps } from '@/lib/types/filter';

const FilterTab = ({ filterKey, items, className = '' }: FilterTabProps) => {
  const { selectedItem, handleChangeItem } = useFilterChange(filterKey);

  if (!items || items.length === 0) return null;

  return (
    <FilterTabs
      value={selectedItem ?? items[0]?.id}
      onValueChange={handleChangeItem}
      className={cn(`my-3 ${className}`)}
    >
      <FilterTabsList>
        {items.map(({ id, name }) => (
          <FilterTabsTrigger key={id} value={id}>
            {name}
          </FilterTabsTrigger>
        ))}
      </FilterTabsList>
    </FilterTabs>
  );
};

export default FilterTab;
