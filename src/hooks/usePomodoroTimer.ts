import { useEffect, useReducer } from "react";
import {
  DEFAULT_DURATIONS,
  createInitialTimerState,
  getInitialDuration,
  getNextMode,
} from "../lib/pomodoro";
import type { PomodoroMode, TimerAction, TimerDurations, TimerState } from "../types/pomodoro";

const TICK_INTERVAL_MS = 1000;

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "start":
      return { ...state, isRunning: true };
    case "pause":
      return { ...state, isRunning: false };
    case "reset":
      return {
        ...state,
        remainingSeconds: getInitialDuration(state.currentMode),
        isRunning: false,
      };
    case "switchMode":
      return {
        ...state,
        currentMode: action.mode,
        remainingSeconds: getInitialDuration(action.mode),
        isRunning: false,
      };
    case "tick": {
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
}

export function usePomodoroTimer() {
  const [state, dispatch] = useReducer(timerReducer, undefined, () => createInitialTimerState());
  const durations: TimerDurations = DEFAULT_DURATIONS;

  useEffect(() => {
    if (!state.isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => dispatch({ type: "tick" }), TICK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [state.isRunning]);

  function handleStart() {
    dispatch({ type: "start" });
  }

  function handlePause() {
    dispatch({ type: "pause" });
  }

  function handleReset() {
    dispatch({ type: "reset" });
  }

  function handleSwitchMode(mode: PomodoroMode) {
    dispatch({ type: "switchMode", mode });
  }

  return {
    state,
    durations,
    handleStart,
    handlePause,
    handleReset,
    handleSwitchMode,
  };
}
