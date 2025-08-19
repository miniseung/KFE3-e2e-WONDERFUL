import { Item } from '@/lib/types/auction';

interface ItemInformationProps {
  item: Item;
}

const ItemDescription = ({ item }: ItemInformationProps) => {
  return (
    <section className="py-6">
      <h3 className="mb-2.5 text-base font-bold">상품 설명</h3>
      <div className="whitespace-pre-wrap">{item.description}</div>
    </section>
  );
};

export default ItemDescription;
