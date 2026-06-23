import { useEffect, useReducer } from "react";
import {
  DEFAULT_DURATIONS,
  createInitialTimerState,
  getInitialDuration,
  getNextMode,
} from "../lib/pomodoro";
import { TIMER_ACTION, type PomodoroMode, type TimerAction, type TimerDurations, type TimerState } from "../types/pomodoro";

const TICK_INTERVAL_MS = 1000;

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case TIMER_ACTION.START:
      return { ...state, isRunning: true };
    case TIMER_ACTION.PAUSE:
      return { ...state, isRunning: false };
    case TIMER_ACTION.RESET:
      return {
        ...state,
        remainingSeconds: getInitialDuration(state.currentMode),
        isRunning: false,
      };
    case TIMER_ACTION.SWITCH_MODE:
      return {
        ...state,
        currentMode: action.mode,
        remainingSeconds: getInitialDuration(action.mode),
        isRunning: false,
      };
    case TIMER_ACTION.TICK: {
      const nextRemainingSeconds = state.remainingSeconds - 1;

      if (nextRemainingSeconds > 0) {
        return { ...state, remainingSeconds: nextRemainingSeconds };
      }

      const completedFocusSessions =
        state.currentMode === "focus" ? state.completedFocusSessions + 1 : state.completedFocusSessions;
      const nextMode = getNextMode(state.currentMode, completedFocusSessions);

      return {
        currentMode: nextMode,
        remainingSeconds: getInitialDuration(nextMode),
        completedFocusSessions,
        isRunning: false,
      };
    }
  }
};

export const usePomodoroTimer = () => {
  const [state, dispatch] = useReducer(timerReducer, createInitialTimerState());
  const durations: TimerDurations = DEFAULT_DURATIONS;

  useEffect(() => {
    if (!state.isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => dispatch({ type: TIMER_ACTION.TICK }), TICK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [state.isRunning]);

  const handleStart = () => {
    dispatch({ type: TIMER_ACTION.START });
  };

  const handlePause = () => {
    dispatch({ type: TIMER_ACTION.PAUSE });
  };

  const handleReset = () => {
    dispatch({ type: TIMER_ACTION.RESET });
  };

  const handleSwitchMode = (mode: PomodoroMode) => {
    dispatch({ type: TIMER_ACTION.SWITCH_MODE, mode });
  };

  return {
    state,
    durations,
    handleStart,
    handlePause,
    handleReset,
    handleSwitchMode,
  };
};
