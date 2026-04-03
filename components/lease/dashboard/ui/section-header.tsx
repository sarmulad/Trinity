import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  searchOpen,
  onToggleSearch,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  searchOpen?: boolean;
  onToggleSearch?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-black dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {onToggleSearch && (
          <button
            type="button"
            onClick={onToggleSearch}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-black/[0.03] transition-colors dark:border-white/10 dark:bg-white/[0.03]",
              searchOpen
                ? "text-[#34C759]"
                : "text-black/45 hover:text-black dark:text-white/45 dark:hover:text-white",
            )}
            aria-label={`Search ${title}`}
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        )}
        {actionLabel && (
          <button
            onClick={onAction}
            className="text-sm text-[#34C759] hover:text-[#28a745]"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
