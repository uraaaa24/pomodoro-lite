export const TIMER_ACTION = {
  START: "start",
  PAUSE: "pause",
  RESET: "reset",
  TICK: "tick",
  SWITCH_MODE: "switchMode",
} as const;

export type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export type TimerDurations = Record<PomodoroMode, number>;

export type CompletedSession = {
  id: number;
  completedMode: PomodoroMode;
  nextMode: PomodoroMode;
};

export type TimerState = {
  currentMode: PomodoroMode;
  remainingSeconds: number;
  completedFocusSessions: number;
  isRunning: boolean;
  lastCompletedSession: CompletedSession | null;
};

export type TimerAction =
  | { type: typeof TIMER_ACTION.START }
  | { type: typeof TIMER_ACTION.PAUSE }
  | { type: typeof TIMER_ACTION.RESET }
  | { type: typeof TIMER_ACTION.TICK; autoStartNextSession: boolean }
  | { type: typeof TIMER_ACTION.SWITCH_MODE; mode: PomodoroMode };
