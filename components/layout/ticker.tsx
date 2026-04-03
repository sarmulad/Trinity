import * as React from "react";

interface TickerItem {
  code: string;
  label: string;
  price: number;
  formatted: string;
}

const FALLBACK: TickerItem[] = [
  { code: "WTI_USD", label: "WTI", price: 0, formatted: "—" },
  { code: "BRENT_CRUDE_USD", label: "BRENT", price: 0, formatted: "—" },
  { code: "NATURAL_GAS_USD", label: "NG", price: 0, formatted: "—" },
  { code: "GASOLINE_RBOB_USD", label: "RBOB", price: 0, formatted: "—" },
  { code: "LOUISIANA_LIGHT_USD", label: "LA LIGHT", price: 0, formatted: "—" },
  { code: "OKLAHOMA_SWEET_USD", label: "OK SWEET", price: 0, formatted: "—" },
  { code: "OKLAHOMA_SOUR_USD", label: "OK SOUR", price: 0, formatted: "—" },
  {
    code: "WESTERN_OKLAHOMA_SWEET_USD",
    label: "W.OK SWEET",
    price: 0,
    formatted: "—",
  },
  {
    code: "OKLAHOMA_INTERMEDIATE_USD",
    label: "OK INT.",
    price: 0,
    formatted: "—",
  },
  { code: "KANSAS_COMMON_USD", label: "KS COMMON", price: 0, formatted: "—" },
  { code: "NW_KANSAS_SWEET_USD", label: "NW KS", price: 0, formatted: "—" },
  { code: "SW_KANSAS_SWEET_USD", label: "SW KS", price: 0, formatted: "—" },
  { code: "OPEC_BASKET_USD", label: "OPEC", price: 0, formatted: "—" },
];

function getIcon(code: string) {
  if (code.startsWith("NATURAL_GAS"))
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
        <svg
          className="h-3 w-3 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="8" />
        </svg>
      </div>
    );
  if (code.startsWith("BRENT") || code.startsWith("OPEC"))
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20">
        <svg
          className="h-3 w-3 text-orange-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2 L14 10 L10 18 L6 10 Z" />
        </svg>
      </div>
    );
  if (code.startsWith("GASOLINE"))
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20">
        <svg
          className="h-3 w-3 text-purple-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <rect x="4" y="4" width="12" height="12" rx="2" />
        </svg>
      </div>
    );
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
      <svg
        className="h-3 w-3 text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 2 L18 10 L10 18 L2 10 Z" />
      </svg>
    </div>
  );
}

function TickerCell({ item }: { item: TickerItem }) {
  const isDash = item.formatted === "—";
  return (
    <div className="flex shrink-0 items-center gap-2 px-4">
      {getIcon(item.code)}
      <span className="text-sm font-medium text-white/60">{item.label}:</span>
      <span
        className={`text-sm font-bold ${isDash ? "text-white/30" : "text-white"}`}
      >
        {item.formatted}
      </span>
      <span className="ml-3 text-white/20">•</span>
    </div>
  );
}

export function Ticker() {
  const [items, setItems] = React.useState<TickerItem[]>(FALLBACK);
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/oil-prices");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setIsLive(true);
        }
      } catch (err) {
        console.error("[Ticker] Failed to load prices:", err);
      }
    }
    load();
    const interval = setInterval(load, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-12 overflow-hidden border-b border-white/10 bg-[#0a0e14]">
      {/* Live dot */}
      {isLive && (
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
          </span>
        </div>
      )}

      <div
        className="flex h-full w-max items-center"
        style={{
          animation: "ticker 30s linear infinite",
        }}
      >
        {items.map((item, idx) => (
          <TickerCell key={`first-${item.code}-${idx}`} item={item} />
        ))}
        {items.map((item, idx) => (
          <TickerCell key={`second-${item.code}-${idx}`} item={item} />
        ))}
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
