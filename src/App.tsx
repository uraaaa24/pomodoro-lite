import { useEffect } from "react";
import { ModeTabs } from "./components/ModeTabs";
import { TimerControls } from "./components/TimerControls";
import { TimerDisplay } from "./components/TimerDisplay";
import { MODE_LABELS, formatTime } from "./lib/pomodoro";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";

export function App() {
  const { state, durations, handlePause, handleReset, handleStart, handleSwitchMode } = usePomodoroTimer();

  useEffect(() => {
    document.title = `${formatTime(state.remainingSeconds)} - ${MODE_LABELS[state.currentMode]} | Pomodoro Lite`;
  }, [state.currentMode, state.remainingSeconds]);

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
      </section>
    </main>
  );
}
