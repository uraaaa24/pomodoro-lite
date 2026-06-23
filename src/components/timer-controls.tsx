type TimerControlsProps = {
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
};

export const TimerControls = ({ isRunning, onPause, onReset, onStart }: TimerControlsProps) => {
  const handlePrimaryAction = isRunning ? onPause : onStart;

  return (
    <div className="flex items-center justify-center gap-3" role="group" aria-label="Timer controls">
      <button
        className="min-h-11 min-w-28 rounded-2xl border-0 bg-[#c8e6d2] px-5 py-3 text-sm font-medium text-[#2f302e] transition-colors hover:bg-[#b7dfc8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]"
        onClick={handlePrimaryAction}
        type="button"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        className="min-h-11 min-w-28 rounded-2xl border border-[#e4e4e0] bg-transparent px-5 py-3 text-sm font-medium text-[#62645f] transition-colors hover:border-[#c8e6d2] hover:text-[#2f302e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]"
        onClick={onReset}
        type="button"
      >
        Reset
      </button>
    </div>
  );
};
