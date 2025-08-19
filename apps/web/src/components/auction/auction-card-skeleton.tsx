const AuctionItemCardSkeleton = () => {
  return (
    <div className="mb-2 flex w-full animate-pulse justify-between gap-2.5">
      <div className="size-21.5 rounded-lg border-neutral-200 bg-neutral-200" />
      <div className="mt-2 flex-1 space-y-2 [&_div]:rounded [&_div]:bg-neutral-200">
        <div className="h-5 w-3/4" />
        <div className="h-4 w-3/5" />
      </div>
    </div>
  );
};

export default AuctionItemCardSkeleton;
