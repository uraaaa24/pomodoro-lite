import { X } from "lucide-react";
import {
  playSessionStartSound,
  prepareSessionCueSound,
  requestDesktopNotificationPermission,
  showSessionCompleteNotification,
} from "../lib/session-cues";
import type { PomodoroSettings } from "../lib/settings";
import type { PomodoroMode } from "../types/pomodoro";

type TimerSettingsProps = {
  settings: PomodoroSettings;
  onClose: () => void;
  onUpdateSetting: <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => void;
};

const checkboxClassName =
  "m-0 h-[1.1rem] w-[1.1rem] accent-[#a8d5ba] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]";

const settingRowClassName =
  "grid min-h-11 grid-cols-[1.25rem_minmax(6rem,1fr)_auto] items-center gap-2.5 max-[360px]:grid-cols-[1.25rem_1fr]";

const settingLabelClassName = "flex min-w-0 items-center text-sm font-medium text-[#62645f]";

const iconToggleClassName = "flex min-w-0 items-center justify-center gap-0 text-sm font-medium text-[#62645f]";

const settingButtonGroupClassName =
  "grid min-w-[6.75rem] grid-flow-col auto-cols-fr gap-1.5 max-[360px]:col-start-2 max-[360px]:row-start-2 max-[360px]:w-full";

const settingTestButtonClassName =
  "min-h-9 min-w-12 rounded-full border border-[#e4e4e0] bg-transparent px-3 py-1 text-xs font-medium text-[#62645f] hover:border-[#c8e6d2] hover:text-[#2f302e] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a8d5ba]";

export const TimerSettings = ({ settings, onClose, onUpdateSetting }: TimerSettingsProps) => {
  const handleNotificationChange = async (enabled: boolean) => {
    if (!enabled) {
      onUpdateSetting("desktopNotificationsEnabled", false);
      return;
    }

    const permission = await requestDesktopNotificationPermission();
    onUpdateSetting("desktopNotificationsEnabled", permission === "granted");
  };

  const handleTestSound = async (startedMode: PomodoroMode) => {
    await prepareSessionCueSound();
    await playSessionStartSound(startedMode, settings.soundVolume);
  };

  const handleTestNotification = async () => {
    const permission = await requestDesktopNotificationPermission();

    if (permission !== "granted") {
      onUpdateSetting("desktopNotificationsEnabled", false);
      return;
    }

    onUpdateSetting("desktopNotificationsEnabled", true);
    await showSessionCompleteNotification("focus", "shortBreak");
  };

  return (
    <section
      aria-labelledby="settings-title"
      className="absolute top-15 right-2 z-10 grid w-[calc(100%-1rem)] max-w-[19.5rem] gap-2 rounded-2xl border border-[#e4e4e0] bg-white/95 p-3.5 text-left shadow-[0_1rem_3rem_rgb(47_48_46_/_12%)] backdrop-blur-md max-[360px]:right-0 max-[360px]:w-full"
      id="settings-panel"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="flex min-h-8 items-center justify-between gap-4">
        <h2 className="m-0 text-sm font-semibold text-[#333432]" id="settings-title">
          Preferences
        </h2>
        <button
          aria-label="Close settings"
          autoFocus
          className="inline-grid h-11 w-11 place-items-center rounded-full border border-transparent bg-transparent p-0 text-[#62645f] hover:border-[#e4e4e0] hover:bg-[#f7f7f5]/80 hover:text-[#2f302e] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a8d5ba] [&_svg]:block"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} strokeWidth={2} />
        </button>
      </div>
      <div className={settingRowClassName}>
        <label className={iconToggleClassName}>
          <input
            checked={settings.soundEnabled}
            className={checkboxClassName}
            onChange={(event) => onUpdateSetting("soundEnabled", event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="sr-only">Enable sound</span>
        </label>
        <span className={settingLabelClassName}>Sound</span>
        <div className={settingButtonGroupClassName} aria-label="Test sound cues">
          <button className={settingTestButtonClassName} onClick={() => void handleTestSound("focus")} type="button">
            Work
          </button>
          <button
            className={settingTestButtonClassName}
            onClick={() => void handleTestSound("shortBreak")}
            type="button"
          >
            Break
          </button>
        </div>
      </div>
      <label className="grid min-h-11 grid-cols-[1.25rem_minmax(6rem,1fr)_auto] items-center gap-2.5">
        <span className="sr-only">Sound volume</span>
        <span aria-hidden="true" />
        <span className={settingLabelClassName}>Volume</span>
        <span className="text-xs font-medium tabular-nums text-[#62645f]">
          {Math.round(settings.soundVolume * 100)}%
        </span>
        <input
          aria-label="Sound volume"
          className="col-start-2 col-end-4 h-2 w-full accent-[#a8d5ba] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]"
          disabled={!settings.soundEnabled}
          max={100}
          min={0}
          onChange={(event) => onUpdateSetting("soundVolume", Number(event.currentTarget.value) / 100)}
          type="range"
          value={Math.round(settings.soundVolume * 100)}
        />
      </label>
      <div className={settingRowClassName}>
        <label className={iconToggleClassName}>
          <input
            checked={settings.desktopNotificationsEnabled}
            className={checkboxClassName}
            onChange={(event) => void handleNotificationChange(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="sr-only">Enable notifications</span>
        </label>
        <span className={settingLabelClassName}>Notification</span>
        <div className={settingButtonGroupClassName}>
          <button className={settingTestButtonClassName} onClick={() => void handleTestNotification()} type="button">
            Test
          </button>
        </div>
      </div>
      <div className="grid min-h-11 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-2.5">
        <label className={iconToggleClassName}>
          <input
            checked={settings.autoStartNextSession}
            className={checkboxClassName}
            onChange={(event) => onUpdateSetting("autoStartNextSession", event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="sr-only">Auto-start next session</span>
        </label>
        <span className={settingLabelClassName}>Auto-start next</span>
      </div>
    </section>
  );
};
