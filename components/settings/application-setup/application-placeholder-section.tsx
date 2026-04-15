"use client";

import { Button } from "@/components/ui/button";

type ApplicationPlaceholderSectionProps = {
  title: string;
  description: string;
  onGoToBatteries: () => void;
};

export function ApplicationPlaceholderSection({
  title,
  description,
  onGoToBatteries,
}: ApplicationPlaceholderSectionProps) {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-black/60 dark:text-white/60">
        {description}
      </p>
      <Button
        type="button"
        variant="outline"
        className="border-[#34C759] bg-transparent text-[#1a7f37] hover:bg-[#34C759]/10 dark:text-[#34C759] dark:hover:bg-[#34C759]/15"
        onClick={onGoToBatteries}
      >
        Go to batteries
      </Button>
    </div>
  );
}
