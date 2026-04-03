export function Sparkline({ color = "#6B7280" }: { color?: string }) {
  return (
    <svg
      width="72"
      height="24"
      viewBox="0 0 72 24"
      fill="none"
      className="opacity-60"
    >
      <polyline
        points="0,20 10,16 20,18 30,8 42,12 52,6 62,10 72,4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
