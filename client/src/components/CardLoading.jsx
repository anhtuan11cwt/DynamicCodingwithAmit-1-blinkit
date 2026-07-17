const CardLoading = () => {
  return (
    <div className="flex h-full w-full min-w-36 max-w-52 shrink-0 animate-pulse flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 shadow">
      <div className="aspect-square w-full rounded bg-blue-50" />

      <div className="h-10 space-y-1">
        <div className="h-4 w-full rounded bg-blue-50" />
        <div className="h-4 w-3/5 rounded bg-blue-50" />
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="h-3 w-1/3 rounded bg-blue-50" />
        <div className="h-4 w-2/3 rounded bg-blue-50" />
        <div className="h-8 w-full rounded bg-blue-50" />
      </div>
    </div>
  );
};

export default CardLoading;
