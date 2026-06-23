import Button from "../shared/button";

type TimerControlsProps = {
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
};

const TimerControls = ({ isRunning, onPause, onReset, onStart }: TimerControlsProps) => {
  const handlePrimaryAction = isRunning ? onPause : onStart;

  return (
    <div className="flex items-center justify-center gap-3" role="group" aria-label="Timer controls">
      <Button onClick={handlePrimaryAction} variant="primary">
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default TimerControls;
