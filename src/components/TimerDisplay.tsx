import { MODE_LABELS, formatTime, getProgressRatio } from "../lib/pomodoro";
import type { TimerDurations, TimerState } from "../types/pomodoro";

type TimerDisplayProps = {
  state: TimerState;
  durations: TimerDurations;
};

export function TimerDisplay({ state, durations }: TimerDisplayProps) {
  const progressPercent = getProgressRatio(state, durations) * 100;
  const formattedTime = formatTime(state.remainingSeconds);

  return (
    <section className="timer-display" aria-label="Current timer">
      <p className="timer-mode" id="session-label">
        {MODE_LABELS[state.currentMode]}
      </p>
      <time className="timer-time" dateTime={`PT${state.remainingSeconds}S`}>
        {formattedTime}
      </time>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
    </section>
  );
}
