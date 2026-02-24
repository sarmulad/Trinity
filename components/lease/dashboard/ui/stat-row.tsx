export function StatRow({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <p className="text-xs text-white/50">
      {label}: <span className={`font-medium ${valueClass}`}>{value}</span>
    </p>
  );
}
