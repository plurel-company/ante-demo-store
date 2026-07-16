"use client";

import { modeLabel, usePlurelMode } from "@/components/plurel-mode-provider";

function ModeBadge({ isLive }: { isLive: boolean }) {
  return (
    <span
      className={`ante-mode-badge ${isLive ? "ante-mode-badge--live" : "ante-mode-badge--sandbox"}`}
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
    <div className="ante-mode-switch">
      <span
        className={`ante-mode-label text-right ${!isLive ? "ante-mode-label--active" : "ante-mode-label--inactive"}`}
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
        className="ante-mode-slider"
      />
      <span
        className={`ante-mode-label ${isLive ? "ante-mode-label--active" : "ante-mode-label--inactive"}`}
      >
        Live
        {isLive ? <ModeBadge isLive /> : null}
      </span>
    </div>
  );
}

export { modeLabel };
