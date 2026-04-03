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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONFIRM_TEXT = "Delete Route";

interface DeleteRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeName?: string;
  onConfirm: () => void;
}

export function DeleteRouteModal({
  open,
  onOpenChange,
  routeName,
  onConfirm,
}: DeleteRouteModalProps) {
  const [confirmInput, setConfirmInput] = React.useState("");
  const isValid = confirmInput.trim() === CONFIRM_TEXT;

  React.useEffect(() => {
    if (open) setConfirmInput("");
  }, [open]);

  const handleConfirm = () => {
    if (!isValid) return;
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
          <p className="text-sm text-black/80 dark:text-white/80">
            Are you sure you want to delete
            {routeName ? ` "${routeName}"` : " it"}?
          </p>

          {/* Confirm input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium text-black dark:text-white">
                Type &apos;{CONFIRM_TEXT}&apos; to confirm
              </Label>
              {isValid && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34C759] text-black">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </div>
            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={CONFIRM_TEXT}
              className="border-black/20 bg-gray-100 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <DialogClose asChild>
              <Button className="w-full bg-[#34C759] font-semibold text-black hover:bg-[#34C759]/90">
                No, Keep Route
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="w-full border border-[#FF383C] bg-transparent font-semibold text-[#FF383C] hover:bg-[#FF383C]/10 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={!isValid}
            >
              Yes, Delete Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
