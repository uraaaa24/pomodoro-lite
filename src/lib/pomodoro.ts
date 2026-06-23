import type { PomodoroMode, TimerDurations, TimerState } from "../types/pomodoro";

export const FOCUS_MINUTES = 25;
export const SHORT_BREAK_MINUTES = 5;
export const LONG_BREAK_MINUTES = 15;
export const LONG_BREAK_INTERVAL = 4;
export const SECONDS_PER_MINUTE = 60;

export const DEFAULT_DURATIONS: TimerDurations = {
  focus: FOCUS_MINUTES * SECONDS_PER_MINUTE,
  shortBreak: SHORT_BREAK_MINUTES * SECONDS_PER_MINUTE,
  longBreak: LONG_BREAK_MINUTES * SECONDS_PER_MINUTE,
};

export const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: "Focus Session",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export const MODE_TAB_LABELS: Record<PomodoroMode, string> = {
  focus: "Focus",
  shortBreak: "Short",
  longBreak: "Long",
};

export const POMODORO_MODES: PomodoroMode[] = ["focus", "shortBreak", "longBreak"];

export const getInitialDuration = (mode: PomodoroMode, durations: TimerDurations = DEFAULT_DURATIONS) =>
  durations[mode];

export const createInitialTimerState = (initialMode: PomodoroMode = "focus"): TimerState => ({
  currentMode: initialMode,
  remainingSeconds: getInitialDuration(initialMode),
  completedFocusSessions: 0,
  isRunning: false,
});

export const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % SECONDS_PER_MINUTE).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export const getNextMode = (currentMode: PomodoroMode, completedFocusSessions: number): PomodoroMode => {
  if (currentMode !== "focus") {
    return "focus";
  }

  return completedFocusSessions % LONG_BREAK_INTERVAL === 0 ? "longBreak" : "shortBreak";
};

export const getProgressRatio = (state: TimerState, durations: TimerDurations = DEFAULT_DURATIONS) => {
  const totalSeconds = durations[state.currentMode];

  if (totalSeconds === 0) {
    return 0;
  }

  return Math.min(Math.max(1 - state.remainingSeconds / totalSeconds, 0), 1);
};
