"use client";

import * as React from "react";
import {
  Search,
  Send,
  Paperclip,
  Database,
  HelpCircle,
  CheckCircle2,
  Ship,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EXAMPLE_MESSAGES } from "./example-data";
import type { Message } from "./types";

interface MessagesTabProps {
  messages?: Message[];
  isLoading?: boolean;
  onSend?: (text: string) => void;
  onAttachPhoto?: () => void;
  onChooseDataPoint?: () => void;
}

export function MessagesTab({
  messages = EXAMPLE_MESSAGES,
  isLoading = false,
  onSend,
  onAttachPhoto,
  onChooseDataPoint,
}: MessagesTabProps) {
  const [search, setSearch] = React.useState("");
  const [newMessage, setNewMessage] = React.useState("");
  const [items, setItems] = React.useState<Message[]>(messages);
  const [selectedAsset, setSelectedAsset] = React.useState("Oil Tank #1");
  const [selectedDataPoint, setSelectedDataPoint] = React.useState("Top Level");
  const [attachedPhotoUrl, setAttachedPhotoUrl] = React.useState("");
  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const dataPointOptions: Record<string, string[]> = {
    "Oil Tank #1": ["Top Level", "Volume", "Theft Level"],
    "Water Tank #1": ["Top Level", "Volume", "Flow Rate"],
    "EFM/Chart #201": [
      "Flow Rate",
      "Static Pressure",
      "Diff. Pressure",
      "Battery",
    ],
    Compressor: ["Oil Pressure", "Discharge Pressure", "RSSI"],
    Pump: ["Oil Pressure", "Run Status", "Battery"],
  };

  React.useEffect(() => {
    const options = dataPointOptions[selectedAsset] ?? [];
    if (!options.includes(selectedDataPoint)) {
      setSelectedDataPoint(options[0] ?? "");
    }
  }, [selectedAsset, selectedDataPoint]);

  const filtered =
    search.trim() === ""
      ? items
      : items.filter((m) => {
          const q = search.toLowerCase();
          return (
            m.authorName.toLowerCase().includes(q) ||
            m.asset.toLowerCase().includes(q) ||
            m.text.toLowerCase().includes(q) ||
            (m.dataPoint ?? "").toLowerCase().includes(q) ||
            (m.dataPointValue ?? "").toLowerCase().includes(q)
          );
        });

  function handleSend() {
    if (!newMessage.trim()) return;
    onSend?.(newMessage.trim());
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const mockPointValue =
      selectedDataPoint === "Top Level"
        ? `7' 2"`
        : selectedDataPoint === "Flow Rate"
          ? "287.89 MCF/Day"
          : selectedDataPoint === "Static Pressure"
            ? "15.67 PSIA"
            : selectedDataPoint === "Diff. Pressure"
              ? "25.89 in. H2O"
              : selectedDataPoint === "Battery"
                ? "13.43 V"
                : "—";
    setItems((prev) => [
      {
        id: String(Date.now()),
        authorName: "You",
        authorInitials: "ME",
        asset: selectedAsset,
        date: timestamp,
        dataPoint: selectedDataPoint,
        dataPointValue: mockPointValue,
        text: newMessage.trim(),
        photoUrl: attachedPhotoUrl || undefined,
      },
      ...prev,
    ]);
    setNewMessage("");
    setAttachedPhotoUrl("");
  }

  function handlePickPhoto() {
    fileInputRef.current?.click();
    onAttachPhoto?.();
  }

  function handlePhotoChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      setAttachedPhotoUrl(url);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-black dark:text-white">
        Messages
      </h2>

      <div className="rounded-xl border border-black/10 bg-black/5 backdrop-blur-md p-5 space-y-3 dark:border-white/10 dark:bg-white/5">
        <div className="relative w-72">
          <Search className="app-search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="app-search-input w-full dark:bg-[#252930]"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-black/30 py-4 text-center dark:text-white/30">
            No messages match your search.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-[#1e2127]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={msg.authorAvatar} />
                      <AvatarFallback className="bg-black/10 text-xs text-black dark:bg-[#2d3440] dark:text-white">
                        {msg.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-black leading-none mb-1 dark:text-white">
                        {msg.authorName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                        <Ship className="h-4 w-4" />
                        {msg.asset}
                      </div>
                      {msg.dataPoint && (
                        <p className="mt-1 text-[11px] text-[#34C759]">
                          {msg.dataPoint}
                          {msg.dataPointValue ? `: ${msg.dataPointValue}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-black/30 shrink-0 dark:text-white/30">
                    {msg.date}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs text-black/60 leading-relaxed dark:text-white/60">
                    {msg.text}
                  </p>
                  {msg.photoUrl && (
                    <button
                      onClick={() => setPreviewPhotoUrl(msg.photoUrl ?? "")}
                      className="shrink-0 rounded-md border border-[#34C759]/40 bg-[#34C759]/10 px-2 py-1 text-[11px] text-[#34C759] hover:bg-[#34C759]/15"
                    >
                      View Photo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Compose ── */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-black dark:text-white">
            Write your message
            <HelpCircle className="h-4 w-4 text-[#34C759]" />
          </label>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Your message"
            rows={4}
            className="w-full rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black placeholder:text-black/25 focus:border-[#34C759]/50 focus:outline-none resize-none dark:border-white/10 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/25"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-black/45 dark:text-white/45">Asset</p>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm text-black focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#252930] dark:text-white"
              >
                {Object.keys(dataPointOptions).map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-black/45 dark:text-white/45">
                Data Point
              </p>
              <select
                value={selectedDataPoint}
                onChange={(e) => setSelectedDataPoint(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm text-black focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#252930] dark:text-white"
              >
                {(dataPointOptions[selectedAsset] ?? []).map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          {attachedPhotoUrl && (
            <button
              onClick={() => setPreviewPhotoUrl(attachedPhotoUrl)}
              className="inline-flex items-center gap-2 rounded-md border border-[#34C759]/40 bg-[#34C759]/10 px-2.5 py-1.5 text-xs text-[#34C759]"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Attached photo ready (click to preview)
            </button>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSend}
              className="flex items-center gap-2 rounded-lg bg-[#34C759] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
            >
              Send
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <button
              onClick={handlePickPhoto}
              className="flex items-center gap-2 rounded-lg border border-[#34C759] px-5 py-2.5 text-sm font-medium text-[#34C759] hover:bg-[#34C759]/10 transition-colors"
            >
              Attach Photo
              <Paperclip className="h-4 w-4" />
            </button>

            <button
              onClick={onChooseDataPoint}
              className="flex items-center gap-2 rounded-lg border border-[#34C759] px-5 py-2.5 text-sm font-medium text-[#34C759] hover:bg-[#34C759]/10 transition-colors"
            >
              Choose Data Point
              <Database className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {previewPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4">
          <div className="mx-auto flex h-full max-w-4xl flex-col rounded-xl border border-white/10 bg-[#16181d] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Photo Preview</p>
              <button
                onClick={() => setPreviewPhotoUrl("")}
                className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto rounded-lg border border-white/10 bg-black/20 p-2">
              <img
                src={previewPhotoUrl}
                alt="Message attachment preview"
                className="mx-auto h-auto max-h-full w-auto rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
