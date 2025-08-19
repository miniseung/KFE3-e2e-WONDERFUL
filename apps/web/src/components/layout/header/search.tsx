import { HeaderWrapper } from '@/components/layout';
import InputSearch from '@/components/search/input-search';

const SearchHeader = () => {
  return (
    <HeaderWrapper className="bg-white">
      <InputSearch />
    </HeaderWrapper>
  );
};

export default SearchHeader;
