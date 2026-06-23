import { Settings as SettingsIcon } from "lucide-react";
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
  const settingsPanelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!isSettingsOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (settingsButtonRef.current?.contains(target) || settingsPanelRef.current?.contains(target)) {
        return;
      }

      setIsSettingsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true });

    return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [isSettingsOpen]);

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
    <main className="grid min-h-screen place-items-center px-5" aria-labelledby="app-title">
      <section className="relative w-full max-w-xs px-2 text-center">
        <header className="mb-5">
          <p className="mt-0 mb-2 text-xs font-medium tracking-[0.18em] text-[#8a8d88] uppercase">Pomodoro Lite</p>
          <h1 className="m-0 text-base font-medium tracking-[-0.01em] text-[#333432]" id="app-title">
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
          className="absolute top-0 right-2 inline-grid h-11 w-11 place-items-center rounded-full border border-[#e4e4e0] bg-white/70 p-0 text-[#62645f] hover:border-[#c8e6d2] hover:text-[#2f302e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba] [&_svg]:block"
          onClick={() => setIsSettingsOpen((current) => !current)}
          ref={settingsButtonRef}
          type="button"
        >
          <SettingsIcon aria-hidden="true" size={18} strokeWidth={2} />
        </button>
        {isSettingsOpen ? (
          <div ref={settingsPanelRef}>
            <TimerSettings
              settings={settings}
              onClose={handleCloseSettings}
              onUpdateSetting={handleSettingsUpdate}
            />
          </div>
        ) : null}
        <p className="sr-only" role="status">
          {statusMessage}
        </p>
      </section>
    </main>
  );
};
