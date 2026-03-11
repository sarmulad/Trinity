export function StatRow({
  label,
  value,
  valueClass = "text-black dark:text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <p className="text-xs text-black/50 dark:text-white/50">
      {label}: <span className={`font-medium ${valueClass}`}>{value}</span>
    </p>
  );
}
