import { useEffect, useRef, useState } from "react";
import { ModeTabs } from "./components/mode-tabs";
import { TimerControls } from "./components/timer-controls";
import { TimerDisplay } from "./components/timer-display";
import { TimerSettings } from "./components/timer-settings";
import { usePomodoroSettings } from "./hooks/usePomodoroSettings";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODE_LABELS, formatTime } from "./lib/pomodoro";
import { playSessionStartSound, prepareSessionCueSound, showSessionCompleteNotification } from "./lib/session-cues";

export const App = () => {
  const { settings, updateSetting } = usePomodoroSettings();
  const { state, durations, handlePause, handleReset, handleStart, handleSwitchMode } = usePomodoroTimer(
    settings.autoStartNextSession,
  );
  const handledSessionId = useRef<number | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready to start a focus session.");

  useEffect(() => {
    document.title = `${formatTime(state.remainingSeconds)} - ${MODE_LABELS[state.currentMode]} | Pomodoro Lite`;
  }, [state.currentMode, state.remainingSeconds]);

  useEffect(() => {
    if (!state.lastCompletedSession || handledSessionId.current === state.lastCompletedSession.id) {
      return;
    }

    handledSessionId.current = state.lastCompletedSession.id;
    setStatusMessage(
      `${MODE_LABELS[state.lastCompletedSession.completedMode]} complete. Next: ${MODE_LABELS[state.lastCompletedSession.nextMode]}.`,
    );

    if (settings.soundEnabled) {
      void playSessionStartSound(state.lastCompletedSession.nextMode);
    }

    if (settings.desktopNotificationsEnabled) {
      void showSessionCompleteNotification(
        state.lastCompletedSession.completedMode,
        state.lastCompletedSession.nextMode,
      );
    }
  }, [settings.desktopNotificationsEnabled, settings.soundEnabled, state.lastCompletedSession]);

  const handleStartWithSound = () => {
    if (settings.soundEnabled) {
      void prepareSessionCueSound();
    }

    handleStart();
  };

  const handleSettingsUpdate = <Key extends keyof typeof settings>(key: Key, value: (typeof settings)[Key]) => {
    if (key === "soundEnabled" && value) {
      void prepareSessionCueSound();
    }

    updateSetting(key, value);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
  };

  return (
    <main className="app-shell" aria-labelledby="app-title">
      <section className="timer-tool">
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
          onStart={handleStartWithSound}
        />
        <button
          aria-controls="settings-panel"
          aria-expanded={isSettingsOpen}
          aria-label="Open preferences"
          className="settings-button"
          onClick={() => setIsSettingsOpen((current) => !current)}
          ref={settingsButtonRef}
          type="button"
        >
          ⚙
        </button>
        {isSettingsOpen ? (
          <TimerSettings
            settings={settings}
            onClose={handleCloseSettings}
            onUpdateSetting={handleSettingsUpdate}
          />
        ) : null}
        <p className="sr-only" role="status">
          {statusMessage}
        </p>
      </section>
    </main>
  );
};
