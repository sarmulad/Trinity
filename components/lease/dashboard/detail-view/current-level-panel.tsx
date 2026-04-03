import type { TankDetailData } from "./types";

interface CurrentLevelPanelProps {
  data: TankDetailData["currentLevel"];
  onHide?: () => void;
}

export function CurrentLevelPanel({ data, onHide }: CurrentLevelPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">Current Level</p>
        <button
          onClick={onHide}
          className="text-xs text-[#34C759] hover:text-[#28a745] flex items-center gap-1"
        >
          Hide ∧
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Oil */}
        <div className="rounded-xl bg-[#1a1d23] border border-white/10 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-base shrink-0">
            🛢
          </div>
          <div>
            <p className="text-[10px] text-white/40 leading-none mb-0.5">Oil</p>
            <p className="text-xs font-semibold text-white">
              {data.oil} ({data.oilBbls})
            </p>
          </div>
        </div>

        {/* Gas Volume */}
        <div className="rounded-xl bg-[#1a1d23] border border-white/10 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-base shrink-0">
            💨
          </div>
          <div>
            <p className="text-[10px] text-white/40 leading-none mb-0.5">
              Gas Volume
            </p>
            <p className="text-xs font-semibold text-white">{data.gasVolume}</p>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-xl bg-[#1a1d23] border border-white/10 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
            #
          </div>
          <div>
            <p className="text-[10px] text-white/40 leading-none mb-0.5">
              Total
            </p>
            <p className="text-xs font-semibold text-white">
              {data.total} ({data.totalBbls})
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="rounded-xl bg-[#1a1d23] border border-white/10 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-base shrink-0">
            🕐
          </div>
          <div>
            <p className="text-[10px] text-white/40 leading-none mb-0.5">
              Time
            </p>
            <p className="text-xs font-semibold text-white">{data.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
