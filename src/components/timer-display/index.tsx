import { MODE_LABELS, formatTime, getProgressRatio } from "../../lib/pomodoro";
import type { TimerDurations, TimerState } from "../../types/pomodoro";

type TimerDisplayProps = {
  state: TimerState;
  durations: TimerDurations;
};

const TimerDisplay = ({ state, durations }: TimerDisplayProps) => {
  const progressPercent = getProgressRatio(state, durations) * 100;
  const formattedTime = formatTime(state.remainingSeconds);
  const currentModeLabel = MODE_LABELS[state.currentMode];
  const elapsedPercent = Math.round(progressPercent);

  return (
    <section
      aria-labelledby="session-label"
      className="mb-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]"
      id="timer-panel"
      role="tabpanel"
      tabIndex={0}
    >
      <p className="mt-0 mb-3 text-sm font-medium text-[#8a8d88]" id="session-label">
        {currentModeLabel}
      </p>
      <time
        aria-label={`${formattedTime} remaining in ${currentModeLabel}`}
        className="mb-5 block font-['Geist_Mono'] text-[clamp(4.25rem,21vw,5.875rem)] leading-none font-medium tracking-[-0.04em] text-[#222222]"
        dateTime={`PT${state.remainingSeconds}S`}
      >
        {formattedTime}
      </time>
      <div
        aria-label={`${currentModeLabel} progress`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={elapsedPercent}
        className="mx-auto h-1 w-full max-w-[300px] overflow-hidden rounded-full bg-white"
        role="progressbar"
      >
        <div
          className="h-full rounded-[inherit] bg-[#a8d5ba] transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
};

export default TimerDisplay;
