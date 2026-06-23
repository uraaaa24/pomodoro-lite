import { MODE_LABELS, formatTime, getProgressRatio } from "../lib/pomodoro";
import type { TimerDurations, TimerState } from "../types/pomodoro";

type TimerDisplayProps = {
  state: TimerState;
  durations: TimerDurations;
};

export const TimerDisplay = ({ state, durations }: TimerDisplayProps) => {
  const progressPercent = getProgressRatio(state, durations) * 100;
  const formattedTime = formatTime(state.remainingSeconds);
  const currentModeLabel = MODE_LABELS[state.currentMode];
  const elapsedPercent = Math.round(progressPercent);

  return (
    <section
      aria-labelledby="session-label"
      className="timer-display"
      id="timer-panel"
      role="tabpanel"
      tabIndex={0}
    >
      <p className="timer-mode" id="session-label">
        {currentModeLabel}
      </p>
      <time
        aria-label={`${formattedTime} remaining in ${currentModeLabel}`}
        className="timer-time"
        dateTime={`PT${state.remainingSeconds}S`}
      >
        {formattedTime}
      </time>
      <div
        aria-label={`${currentModeLabel} progress`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={elapsedPercent}
        className="progress-track"
        role="progressbar"
      >
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
    </section>
  );
};
