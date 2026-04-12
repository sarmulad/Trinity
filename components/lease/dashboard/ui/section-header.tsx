import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  searchOpen,
  onToggleSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchClear,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  searchOpen?: boolean;
  onToggleSearch?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-base font-bold text-black dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {onToggleSearch && (
          <>
            {searchOpen ? (
              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35 dark:text-white/35" />
                <input
                  autoFocus
                  type="text"
                  placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}...`}
                  value={searchValue ?? ""}
                  onChange={(event) => onSearchChange?.(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") onSearchClear?.();
                  }}
                  className="w-full rounded-lg border border-black/10 bg-white py-2 pl-9 pr-8 text-sm text-black outline-none transition-colors placeholder:text-black/30 focus:border-[#34C759]/50 dark:border-white/10 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={onSearchClear}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-black/35 hover:bg-black/5 hover:text-black dark:text-white/35 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label={`Clear ${title} search`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onToggleSearch}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm transition-colors dark:border-white/10 dark:bg-[#252930]",
                  "text-black/45 hover:border-[#34C759]/40 hover:text-black dark:text-white/45 dark:hover:text-white",
                )}
                aria-label={`Search ${title}`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>{searchPlaceholder ?? `Search ${title.toLowerCase()}`}</span>
              </button>
            )}
          </>
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
