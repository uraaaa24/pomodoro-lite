import { MODE_TAB_LABELS, POMODORO_MODES } from "../lib/pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

type ModeTabsProps = {
  currentMode: PomodoroMode;
  onSwitchMode: (mode: PomodoroMode) => void;
};

export function ModeTabs({ currentMode, onSwitchMode }: ModeTabsProps) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Timer modes">
      {POMODORO_MODES.map((mode) => {
        const isActive = mode === currentMode;

        return (
          <button
            aria-selected={isActive}
            className="mode-tab"
            data-active={isActive}
            key={mode}
            onClick={() => onSwitchMode(mode)}
            type="button"
          >
            {MODE_TAB_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}
