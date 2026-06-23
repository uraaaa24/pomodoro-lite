export type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export type TimerDurations = Record<PomodoroMode, number>;

export type TimerState = {
  currentMode: PomodoroMode;
  remainingSeconds: number;
  completedFocusSessions: number;
  isRunning: boolean;
};

export type TimerAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "switchMode"; mode: PomodoroMode };
