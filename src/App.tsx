import { useEffect, useRef } from "react";
import { ModeTabs } from "./components/mode-tabs";
import { TimerControls } from "./components/timer-controls";
import { TimerDisplay } from "./components/timer-display";
import { TimerSettings } from "./components/timer-settings";
import { usePomodoroSettings } from "./hooks/usePomodoroSettings";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODE_LABELS, formatTime } from "./lib/pomodoro";
import { playSessionCompleteSound, showSessionCompleteNotification } from "./lib/session-cues";

export const App = () => {
  const { settings, updateSetting } = usePomodoroSettings();
  const { state, durations, handlePause, handleReset, handleStart, handleSwitchMode } = usePomodoroTimer(
    settings.autoStartNextSession,
  );
  const handledSessionId = useRef<number | null>(null);

  useEffect(() => {
    document.title = `${formatTime(state.remainingSeconds)} - ${MODE_LABELS[state.currentMode]} | Pomodoro Lite`;
  }, [state.currentMode, state.remainingSeconds]);

  useEffect(() => {
    if (!state.lastCompletedSession || handledSessionId.current === state.lastCompletedSession.id) {
      return;
    }

    handledSessionId.current = state.lastCompletedSession.id;

    if (settings.soundEnabled) {
      playSessionCompleteSound(state.lastCompletedSession.completedMode);
    }

    if (settings.desktopNotificationsEnabled) {
      showSessionCompleteNotification(
        state.lastCompletedSession.completedMode,
        state.lastCompletedSession.nextMode,
      );
    }
  }, [settings.desktopNotificationsEnabled, settings.soundEnabled, state.lastCompletedSession]);

  return (
    <main className="app-shell" aria-labelledby="app-title">
      <section className="timer-tool" aria-live="polite">
        <header className="app-header">
          <p className="app-kicker">Pomodoro Lite</p>
          <h1 className="app-title" id="app-title">
            Quiet timer for deep work
          </h1>
        </header>

        <ModeTabs currentMode={state.currentMode} onSwitchMode={handleSwitchMode} />
        <TimerDisplay durations={durations} state={state} />
        <TimerControls
          isRunning={state.isRunning}
          onPause={handlePause}
          onReset={handleReset}
          onStart={handleStart}
        />
        <TimerSettings settings={settings} onUpdateSetting={updateSetting} />
      </section>
    </main>
  );
};
