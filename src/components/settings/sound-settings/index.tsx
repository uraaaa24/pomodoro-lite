import { prepareSessionCueSound, playSessionStartSound } from "../../../lib/session-cues";
import type { PomodoroMode } from "../../../types/pomodoro";
import Button from "../../shared/button";
import SettingRow, { settingLabelClassName } from "../../shared/setting-row";

const settingButtonGroupClassName =
  "grid min-w-[6.75rem] grid-flow-col auto-cols-fr gap-1.5 max-[360px]:col-start-2 max-[360px]:row-start-2 max-[360px]:w-full";

type SoundSettingsProps = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
};

const SoundSettings = ({ enabled, onEnabledChange, onVolumeChange, volume }: SoundSettingsProps) => {
  const handleTestSound = async (startedMode: PomodoroMode) => {
    await prepareSessionCueSound();
    await playSessionStartSound(startedMode, volume);
  };

  return (
    <>
      <SettingRow
        action={
          <div className={settingButtonGroupClassName} aria-label="Test sound cues">
            <Button onClick={() => void handleTestSound("focus")} size="sm">
              Work
            </Button>
            <Button onClick={() => void handleTestSound("shortBreak")} size="sm">
              Break
            </Button>
          </div>
        }
        checked={enabled}
        label="Sound"
        onChange={onEnabledChange}
      />
      <label className="grid min-h-11 grid-cols-[1.25rem_minmax(6rem,1fr)_auto] items-center gap-2.5">
        <span className="sr-only">Sound volume</span>
        <span aria-hidden="true" />
        <span className={settingLabelClassName}>Volume</span>
        <span className="text-xs font-medium tabular-nums text-[#62645f]">{Math.round(volume * 100)}%</span>
        <input
          aria-label="Sound volume"
          className="col-start-2 col-end-4 h-2 w-full accent-[#a8d5ba] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]"
          disabled={!enabled}
          max={100}
          min={0}
          onChange={(event) => onVolumeChange(Number(event.currentTarget.value) / 100)}
          type="range"
          value={Math.round(volume * 100)}
        />
      </label>
    </>
  );
};

export default SoundSettings;
