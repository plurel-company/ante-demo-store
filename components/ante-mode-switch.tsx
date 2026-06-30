"use client";

import { modeLabel, useAnteMode } from "@/components/ante-mode-provider";

function ModeBadge({ mode }: { mode: "sandbox" | "live" }) {
  const isLive = mode === "live";
  return (
    <span
      className={`ante-mode-badge ${isLive ? "ante-mode-badge--live" : "ante-mode-badge--sandbox"}`}
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
    <div className="ante-mode-switch">
      <span
        className={`ante-mode-label text-right ${!isLive ? "ante-mode-label--active" : "ante-mode-label--inactive"}`}
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
        className={`ante-mode-label ${isLive ? "ante-mode-label--active" : "ante-mode-label--inactive"}`}
      >
        Live
      </span>
    </div>
  );
}
