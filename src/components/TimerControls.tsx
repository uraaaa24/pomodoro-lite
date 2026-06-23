type TimerControlsProps = {
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
};

export function TimerControls({ isRunning, onPause, onReset, onStart }: TimerControlsProps) {
  const handlePrimaryAction = isRunning ? onPause : onStart;

  return (
    <div className="timer-controls" aria-label="Timer controls">
      <button className="button button-primary" onClick={handlePrimaryAction} type="button">
        {isRunning ? "Pause" : "Start"}
      </button>
      <button className="button button-secondary" onClick={onReset} type="button">
        Reset
      </button>
    </div>
  );
}
