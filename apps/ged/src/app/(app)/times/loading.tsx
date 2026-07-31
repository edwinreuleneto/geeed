export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-black/5" />
          <div className="h-9 w-40 animate-pulse rounded bg-black/5" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-black/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-[18px] bg-black/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
