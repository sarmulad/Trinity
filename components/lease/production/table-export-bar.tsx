"use client";

import React from "react";

interface TableExportBarProps {
  title: string;
  onExportCsv: () => void;
  onExportOds: () => Promise<void>;
  onExportPng: () => Promise<void>;
}

function ExportButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5 rounded-md border border-black/10
        bg-white px-2.5 py-1.5 text-xs font-medium text-black/60
        shadow-sm transition-all
        hover:border-black/20 hover:bg-gray-50 hover:text-black/80
        active:scale-95
        dark:border-white/10 dark:bg-white/5 dark:text-white/50
        dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white/80
      "
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

// Inline SVG icons — no extra dependency needed
const CsvIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2h7l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M9 2v4h4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M5 10.5c-.5 0-1-.45-1-1s.5-1 1-1 1 .45 1 1-.5 1-1 1zM8 8.5l1 4M11 8.5l-1 4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const OdsIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2h7l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M9 2v4h4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <rect
      x="4"
      y="8.5"
      width="7"
      height="4"
      rx=".5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path d="M4 10.5h7M7.5 8.5v4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const PngIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M1 11l3.5-3.5 2.5 2.5 3-3.5L15 11"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="5" cy="5.5" r="1.2" fill="currentColor" />
  </svg>
);

export function TableExportBar({
  title,
  onExportCsv,
  onExportOds,
  onExportPng,
}: TableExportBarProps) {
  return (
    <div className="flex items-center justify-between px-1 pb-2">
      <span className="text-sm font-semibold text-black/70 dark:text-white/70">
        {title}
      </span>
      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs text-black/30 dark:text-white/30">
          Export:
        </span>
        <ExportButton label="CSV" icon={<CsvIcon />} onClick={onExportCsv} />
        <ExportButton label="ODS" icon={<OdsIcon />} onClick={onExportOds} />
        <ExportButton label="Image" icon={<PngIcon />} onClick={onExportPng} />
      </div>
    </div>
  );
}
