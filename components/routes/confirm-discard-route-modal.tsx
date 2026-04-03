"use client";

import * as React from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDiscardRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
/**
 * Simple confirm modal for the route creation/editing flow.
 * Shown when user clicks "Delete Route" inside the New Route modal.
 * Does not require typing to confirm — just "No, Keep Route" / "Yes, Delete Route".
 */
export function ConfirmDiscardRouteModal({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDiscardRouteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-black/10 bg-white p-0 text-black [&>button]:hidden dark:border-white/10 dark:bg-[#1A1C1E] dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-black dark:text-white">
              Delete Route
            </DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[#34C759] hover:text-[#34C759]/90"
            >
              <span>Close</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#34C759]">
                <X className="h-3.5 w-3.5" />
              </span>
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 pb-6 pt-4">
          <p className="text-center text-sm text-black/80 dark:text-white/80">
            Are you sure you want to delete it?
          </p>
          <div className="flex w-full flex-col gap-3">
            <DialogClose asChild>
              <Button className="w-full bg-[#34C759] text-black hover:bg-[#34C759]/90">
                No, Keep Route
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="w-full border border-[#FF383C] bg-transparent font-semibold text-[#FF383C] hover:bg-[#FF383C]/10"
              onClick={handleConfirm}
            >
              Yes, Delete Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
