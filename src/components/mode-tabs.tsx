import type { KeyboardEvent } from "react";
import { MODE_TAB_LABELS, POMODORO_MODES } from "../lib/pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

type ModeTabsProps = {
  currentMode: PomodoroMode;
  onSwitchMode: (mode: PomodoroMode) => void;
};

export const ModeTabs = ({ currentMode, onSwitchMode }: ModeTabsProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, mode: PomodoroMode) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = POMODORO_MODES.indexOf(mode);
    const nextIndex = (() => {
      if (event.key === "Home") {
        return 0;
      }

      if (event.key === "End") {
        return POMODORO_MODES.length - 1;
      }

      return event.key === "ArrowRight"
        ? (currentIndex + 1) % POMODORO_MODES.length
        : (currentIndex - 1 + POMODORO_MODES.length) % POMODORO_MODES.length;
    })();
    const nextMode = POMODORO_MODES[nextIndex];

    onSwitchMode(nextMode);
    window.requestAnimationFrame(() => document.getElementById(`mode-tab-${nextMode}`)?.focus());
  };

  return (
    <div className="mode-tabs" role="tablist" aria-label="Timer modes">
      {POMODORO_MODES.map((mode) => {
        const isActive = mode === currentMode;

        return (
          <button
            aria-controls="timer-panel"
            aria-selected={isActive}
            className="mode-tab"
            data-active={isActive}
            id={`mode-tab-${mode}`}
            key={mode}
            onClick={() => onSwitchMode(mode)}
            onKeyDown={(event) => handleKeyDown(event, mode)}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
          >
            {MODE_TAB_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
};
