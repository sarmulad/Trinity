import React from "react";

const DashboardPreviews: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-[420px] h-[285px]">
        <div className="absolute top-0 left-0 z-0 w-[312px] rounded-xl border border-white/10 bg-[#2d3440]/80 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-white/90">Oil Tank #1</span>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
          </div>
          <svg viewBox="0 0 200 60" className="h-12 w-full">
            <polyline
              points="0,40 20,35 40,38 60,30 80,32 100,28 120,25 140,30 160,27 180,25 200,28"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="absolute top-10 right-0 z-20 w-72 rounded-xl border border-white/10 bg-[#2d3440]/80 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-white/90">EFM/Chart #201</span>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
            </div>
          </div>
          <svg viewBox="0 0 200 60" className="h-12 w-full">
            <polyline
              points="0,45 20,42 40,38 60,35 80,30 100,28 120,32 140,30 160,25 180,22 200,20"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="absolute top-[120px] left-8 z-10 w-56 rounded-xl border border-white/10 bg-[#2d3440]/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="20"
                strokeDasharray="175 251"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="flex-1 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreviews;
