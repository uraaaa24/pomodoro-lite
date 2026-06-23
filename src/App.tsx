import { BarChart3, Settings as SettingsIcon } from "lucide-react";

import { useDailyFocusSummary } from "./hooks/useDailyFocusSummary";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import { usePomodoroSettings } from "./hooks/usePomodoroSettings";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { useSessionCompletion } from "./hooks/useSessionCompletion";
import { usePanelGroup } from "./hooks/usePanelGroup";
import { MODE_LABELS, formatTime } from "./lib/pomodoro";
import { prepareSessionCueSound } from "./lib/session-cues";
import ModeTabs from "./components/mode-tabs";
import Button from "./components/shared/button";
import TimerControls from "./components/timer-controls";
import TimerDisplay from "./components/timer-display";
import TimerSettings from "./components/timer-settings";
import TodayFocusSummary from "./components/today-focus-summary";

export const App = () => {
  const { settings, updateSetting } = usePomodoroSettings();
  const { state, durations, handlePause, handleReset, handleStart, handleSwitchMode } = usePomodoroTimer(
    settings.autoStartNextSession,
  );
  const panels = usePanelGroup();
  const dailyFocusSummary = useDailyFocusSummary(state.lastCompletedSession);
  const statusMessage = useSessionCompletion({ lastCompletedSession: state.lastCompletedSession, settings });

  useDocumentTitle(`${formatTime(state.remainingSeconds)} - ${MODE_LABELS[state.currentMode]} | Pomodoro Lite`);

  const handleStartWithSound = () => {
    if (settings.soundEnabled) {
      void prepareSessionCueSound();
    }

    handleStart();
  };

  const handleFocusSummaryToggle = () => {
    panels.toggle("focusSummary");
  };

  const handleFocusSummaryClose = () => {
    panels.close("focusSummary");
  };

  const handleSettingsToggle = () => {
    panels.toggle("settings");
  };

  const handleSettingsUpdate = <Key extends keyof typeof settings>(key: Key, value: (typeof settings)[Key]) => {
    if (key === "soundEnabled" && value) {
      void prepareSessionCueSound();
    }

    updateSetting(key, value);
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
        <Button
          aria-controls="today-focus-panel"
          aria-expanded={panels.isOpen("focusSummary")}
          aria-haspopup="dialog"
          aria-label="Open focus summary"
          className="absolute top-0 left-2 bg-white/70"
          onClick={handleFocusSummaryToggle}
          ref={panels.getButtonRef("focusSummary")}
          size="icon"
        >
          <BarChart3 aria-hidden="true" size={18} strokeWidth={2} />
        </Button>
        <Button
          aria-controls="settings-panel"
          aria-expanded={panels.isOpen("settings")}
          aria-haspopup="dialog"
          aria-label="Open preferences"
          className="absolute top-0 right-2 bg-white/70"
          onClick={handleSettingsToggle}
          ref={panels.getButtonRef("settings")}
          size="icon"
        >
          <SettingsIcon aria-hidden="true" size={18} strokeWidth={2} />
        </Button>
        {panels.isOpen("focusSummary") ? (
          <div ref={panels.getPanelRef("focusSummary")}>
            <TodayFocusSummary
              summary={dailyFocusSummary}
              onClose={handleFocusSummaryClose}
            />
          </div>
        ) : null}
        {panels.isOpen("settings") ? (
          <div ref={panels.getPanelRef("settings")}>
            <TimerSettings
              settings={settings}
              onClose={() => panels.close("settings")}
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
