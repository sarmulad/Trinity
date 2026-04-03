"use client";

import * as React from "react";
import {
  Search,
  Reply,
  Send,
  Paperclip,
  Database,
  HelpCircle,
  CheckCircle2,
  Ship,
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

  const filtered =
    search.trim() === ""
      ? messages
      : messages.filter((m) => {
          const q = search.toLowerCase();
          return (
            m.authorName.toLowerCase().includes(q) ||
            m.asset.toLowerCase().includes(q) ||
            m.text.toLowerCase().includes(q)
          );
        });

  function handleSend() {
    if (!newMessage.trim()) return;
    onSend?.(newMessage.trim());
    setNewMessage("");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-black dark:text-white">
        Messages
      </h2>

      <div className="rounded-xl border border-black/10 bg-black/5 backdrop-blur-md p-5 space-y-3 dark:border-white/10 dark:bg-white/5">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 pointer-events-none dark:text-white/30" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-black/5 py-2 pl-9 pr-3 text-sm text-black placeholder:text-black/30 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/30"
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
                    </div>
                  </div>
                  <p className="text-xs text-black/30 shrink-0 dark:text-white/30">
                    {msg.date}
                  </p>
                </div>

                {/* Body */}
                <div className="flex items-end justify-between gap-4">
                  <p className="text-xs text-black/60 leading-relaxed dark:text-white/60">
                    {msg.text}
                  </p>
                  <button className="flex items-center gap-1 text-xs text-[#34C759] hover:text-[#28a745] shrink-0 transition-colors">
                    <Reply className="h-3.5 w-3.5" />
                    Reply
                  </button>
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

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSend}
              className="flex items-center gap-2 rounded-lg bg-[#34C759] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
            >
              Send
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <button
              onClick={onAttachPhoto}
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
    </div>
  );
}
