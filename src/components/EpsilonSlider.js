"use client";

import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function EpsilonSlider({
  value,
  onChange,
  orientation = "horizontal",
  color = "emerald",
  className,
}) {
  // display percentage of actual epsilon value (0..1)
  const pct = useMemo(() => Math.round((value ?? 0) * 100), [value]);

  // Piecewise mapping anchors (pct -> epsilon):
  // 0 -> 0.00, 50 -> 0.10, 60 -> 0.20, 70 -> 0.50, 100 -> 1.00
  const epsilonFromPct = (p) => {
    const pct = Math.max(0, Math.min(100, p));
    if (pct <= 50) return (0.1 / 50) * pct; // 0..0.1
    if (pct <= 60) return 0.1 + ((pct - 50) / 10) * 0.1; // 0.1..0.2
    if (pct <= 70) return 0.2 + ((pct - 60) / 10) * 0.3; // 0.2..0.5
    return 0.5 + ((pct - 70) / 30) * 0.5; // 0.5..1.0
  };

  const pctFromEpsilon = (e) => {
    const eps = Math.max(0, Math.min(1, e ?? 0));
    if (eps <= 0.1) return (eps / 0.1) * 50; // 0..50
    if (eps <= 0.2) return 50 + ((eps - 0.1) / 0.1) * 10; // 50..60
    if (eps <= 0.5) return 60 + ((eps - 0.2) / 0.3) * 10; // 60..70
    return 70 + ((eps - 0.5) / 0.5) * 30; // 70..100
  };

  const uiPct = useMemo(() => Math.round(pctFromEpsilon(value ?? 0)), [value]);
  return (
    <div className="flex flex-col items-stretch gap-2 w-[20rem] mb-3 mt-3 ">

      <div className="flex flex-row items-center gap-3 w-full">
        <span className="text-xs font-medium text-gray-700 w-16 shrink-0">
          Epsilon :
        </span>
        <Slider
          value={[uiPct]}
          min={0}
          max={100}
          step={1}
          onValueChange={(v) => onChange?.(epsilonFromPct(v[0]))}
          aria-label="Epsilon"
          orientation={orientation}
          color={color}
          className={cn("w-full", className)}
        />
      </div>
            <div className="text-xs font-medium tabular-nums text-gray-700">
        ε = {(value ?? 0).toFixed(2)} ({pct}%)
      </div>
    </div>
  );
}
