export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-black dark:text-white">
        {title}
      </h2>
      <button
        onClick={onAction}
        className="text-sm text-[#34C759] hover:text-[#28a745]"
      >
        {actionLabel} →
      </button>
    </div>
  );
}
