import productCardStyle from '@/components/chat/style';

const ProductCardSkeleton = () => {
  return (
    <div className={productCardStyle().wrapper({ loading: true })}>
      <div className={productCardStyle().content()}>
        <div className="h-12 w-12 rounded-md bg-neutral-200" />
        <div className={productCardStyle().infoBox()}>
          <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200" />
          <div className="h-3 w-1/2 rounded bg-neutral-200" />
        </div>
      </div>
      <div className={productCardStyle().buttonBox()}>
        <div className={productCardStyle().button()} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
