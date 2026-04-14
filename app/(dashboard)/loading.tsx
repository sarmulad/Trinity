export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy aria-label="Loading page">
      <div className="h-8 w-48 rounded-md bg-black/10 dark:bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-lg border border-black/10 bg-white/80 dark:border-white/10 dark:bg-[#1A1C1E]/80"
          />
        ))}
      </div>
      <div className="h-64 rounded-lg border border-black/10 bg-white/80 dark:border-white/10 dark:bg-[#1A1C1E]/80" />
    </div>
  );
}
