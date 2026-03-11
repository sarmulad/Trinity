import * as React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1e2025]">
      {children}
    </div>
  );
}
