export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 animate-pulse rounded bg-hairline" />
          <div className="h-7 w-64 animate-pulse rounded bg-hairline" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-hairline" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-5">
            <div className="h-64 animate-pulse rounded-xl bg-hairline" />
            <div className="h-64 animate-pulse rounded-xl bg-hairline" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-64 animate-pulse rounded-xl bg-hairline" />
            <div className="h-40 animate-pulse rounded-xl bg-hairline" />
          </div>
        </div>
      </div>
    </main>
  );
}
