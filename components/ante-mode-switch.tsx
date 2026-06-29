"use client";

import { modeLabel, useAnteMode } from "@/components/ante-mode-provider";

function ModeBadge({ mode }: { mode: "sandbox" | "live" }) {
  const isLive = mode === "live";
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        isLive ? "bg-violet-100 text-violet-900" : "bg-sky-100 text-sky-900"
      }`}
    >
      {modeLabel(mode)} only
    </span>
  );
}

export function AnteModeSwitch() {
  const { mode, setMode, hasTestKey, hasLiveKey } = useAnteMode();
  const isLive = mode === "live";
  const canToggle = hasTestKey && hasLiveKey;

  if (!hasTestKey && !hasLiveKey) return null;
  if (!canToggle) {
    return <ModeBadge mode={hasLiveKey ? "live" : "sandbox"} />;
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={`min-w-[2rem] text-right text-xs font-semibold transition-colors ${
          !isLive ? "text-stone-900" : "text-stone-400"
        }`}
      >
        Test
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={1}
        value={isLive ? 1 : 0}
        onChange={(event) => setMode(Number(event.target.value) === 1 ? "live" : "sandbox")}
        aria-label="Ante key mode"
        aria-valuetext={isLive ? "Live" : "Test"}
        className="ante-mode-slider"
        style={{ "--slider-fill": isLive ? "100%" : "0%" } as React.CSSProperties}
      />
      <span
        className={`min-w-[2rem] text-xs font-semibold transition-colors ${
          isLive ? "text-stone-900" : "text-stone-400"
        }`}
      >
        Live
      </span>
    </div>
  );
}
