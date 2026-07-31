export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-hairline" />
          <div className="h-6 w-40 animate-pulse rounded bg-hairline" />
          <div className="h-3 w-80 max-w-full animate-pulse rounded bg-hairline" />
        </div>
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-40 shrink-0 animate-pulse rounded-xl bg-hairline" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-hairline" />
          ))}
        </div>
      </div>
    </main>
  );
}
