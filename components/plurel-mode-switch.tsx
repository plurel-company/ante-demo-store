"use client";

import { modeLabel, usePlurelMode } from "@/components/plurel-mode-provider";

function ModeBadge({ isLive }: { isLive: boolean }) {
  return (
    <span
      className={`plurel-mode-badge ${isLive ? "plurel-mode-badge--live" : "plurel-mode-badge--sandbox"}`}
    >
      {isLive ? "Live" : "Test"}
    </span>
  );
}

export function PlurelModeSwitch() {
  const { mode, setMode, hasTestKey, hasLiveKey } = usePlurelMode();
  const isLive = mode === "live";
  const sliderMax = hasTestKey && hasLiveKey ? 1 : 0;
  const sliderValue = isLive && hasLiveKey ? 1 : 0;
  const sliderDisabled = !hasTestKey || !hasLiveKey;

  return (
    <div className="plurel-mode-switch">
      <span
        className={`plurel-mode-label text-right ${!isLive ? "plurel-mode-label--active" : "plurel-mode-label--inactive"}`}
      >
        Test
        {!isLive ? <ModeBadge isLive={false} /> : null}
      </span>
      <input
        type="range"
        min={0}
        max={sliderMax}
        step={1}
        value={sliderValue}
        disabled={sliderDisabled}
        aria-label="Plurel Pay key mode"
        onChange={(event) => setMode(Number(event.target.value) === 1 ? "live" : "sandbox")}
        className="plurel-mode-slider"
      />
      <span
        className={`plurel-mode-label ${isLive ? "plurel-mode-label--active" : "plurel-mode-label--inactive"}`}
      >
        Live
        {isLive ? <ModeBadge isLive /> : null}
      </span>
    </div>
  );
}

export { modeLabel };
