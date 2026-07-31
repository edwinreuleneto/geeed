export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <div className="mb-4 h-3 w-32 animate-pulse rounded bg-hairline" />
      <div className="mb-5 h-24 animate-pulse rounded-2xl bg-hairline" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[520px] animate-pulse rounded-2xl bg-hairline" />
        <div className="flex flex-col gap-5">
          <div className="h-80 animate-pulse rounded-2xl bg-hairline" />
          <div className="h-64 animate-pulse rounded-2xl bg-hairline" />
        </div>
      </div>
    </main>
  );
}
