const Skeleton = () => (
  <div className="flex min-h-screen animate-pulse flex-col items-start justify-start gap-4">
    <div className="aspect-square max-h-[360px] w-full bg-neutral-200 object-cover" />
    <div className="flex w-full items-center gap-3 bg-white px-4 py-3">
      <div className="flex size-10 rounded-full bg-neutral-200" />
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 rounded-md bg-neutral-200" />
        <div className="h-3 rounded-md bg-neutral-200" />
      </div>
    </div>
    <div className="flex w-full flex-col justify-start gap-2 bg-white px-4 py-3">
      <div className="h-6 w-1/2 rounded-md bg-neutral-200" />
      <div className="h-8 w-2/3 rounded-md bg-neutral-200" />
    </div>
  </div>
);

export default Skeleton;
