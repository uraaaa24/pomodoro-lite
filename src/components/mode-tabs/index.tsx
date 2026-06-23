import type { KeyboardEvent } from "react";
import { MODE_TAB_LABELS, POMODORO_MODES } from "../../lib/pomodoro";
import type { PomodoroMode } from "../../types/pomodoro";

type ModeTabsProps = {
  currentMode: PomodoroMode;
  onSwitchMode: (mode: PomodoroMode) => void;
};

const ModeTabs = ({ currentMode, onSwitchMode }: ModeTabsProps) => {
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
    <div className="mb-5 flex justify-center rounded-full bg-white p-1" role="tablist" aria-label="Timer modes">
      {POMODORO_MODES.map((mode) => {
        const isActive = mode === currentMode;

        return (
          <button
            aria-controls="timer-panel"
            aria-selected={isActive}
            className={`min-h-11 min-w-11 flex-1 rounded-full border-0 px-4 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba] ${
              isActive ? "bg-[#c8e6d2] text-[#2f302e]" : "bg-transparent text-[#8a8d88]"
            }`}
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

export default ModeTabs;
