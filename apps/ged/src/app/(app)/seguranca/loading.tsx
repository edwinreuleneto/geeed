export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3 w-24 animate-pulse rounded bg-hairline" />
        <div className="h-6 w-56 animate-pulse rounded bg-hairline" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-hairline" />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-hairline" />
        <div className="h-72 animate-pulse rounded-2xl bg-hairline" />
      </div>
    </main>
  );
}
