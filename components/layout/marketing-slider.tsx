"use client";

import * as React from "react";
import DashboardPreviews from "@/components/layout/dashboard-previews";

const SLIDES = [
  {
    title: "Monitor oil wells in real time",
    description:
      "Track production data, receive instant alarms, message your team, and compare wells from one clear dashboard.",
  },
  {
    title: "Receive instant alerts & alarms",
    description:
      "Get notified the moment a well underperforms. Set custom thresholds and escalate issues to the right people automatically.",
  },
  {
    title: "Compare wells side by side",
    description:
      "Visualize production trends across multiple wells simultaneously and make data-driven decisions faster.",
  },
];

export default function MarketingSlider() {
  const [current, setCurrent] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => {
      goTo((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  function goTo(indexOrUpdater: number | ((prev: number) => number)) {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(
        typeof indexOrUpdater === "function"
          ? indexOrUpdater(current)
          : indexOrUpdater,
      );
      setAnimating(false);
    }, 300);
  }

  const slide = SLIDES[current];

  return (
    <div className="relative z-10 flex flex-col items-center">
      <DashboardPreviews />

      <div
        className="relative z-10 text-center max-w-[348px] transition-all duration-300"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0px)",
        }}
      >
        <h2 className="mb-3 text-2xl font-semibold text-white">
          {slide.title}
        </h2>
        <p className="text-pretty text-sm leading-relaxed text-white/70">
          {slide.description}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width: i === current ? "20px" : "8px",
              backgroundColor:
                i === current
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
