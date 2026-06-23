import { requestDesktopNotificationPermission } from "../lib/session-cues";
import type { PomodoroSettings } from "../lib/settings";

type TimerSettingsProps = {
  settings: PomodoroSettings;
  onUpdateSetting: <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => void;
};

export const TimerSettings = ({ settings, onUpdateSetting }: TimerSettingsProps) => {
  const handleNotificationChange = async (enabled: boolean) => {
    if (!enabled) {
      onUpdateSetting("desktopNotificationsEnabled", false);
      return;
    }

    const permission = await requestDesktopNotificationPermission();
    onUpdateSetting("desktopNotificationsEnabled", permission === "granted");
  };

  return (
    <section className="timer-settings" aria-label="Timer settings">
      <label className="setting-toggle">
        <input
          checked={settings.soundEnabled}
          onChange={(event) => onUpdateSetting("soundEnabled", event.currentTarget.checked)}
          type="checkbox"
        />
        <span>Sound</span>
      </label>
      <label className="setting-toggle">
        <input
          checked={settings.desktopNotificationsEnabled}
          onChange={(event) => void handleNotificationChange(event.currentTarget.checked)}
          type="checkbox"
        />
        <span>Desktop notification</span>
      </label>
      <label className="setting-toggle">
        <input
          checked={settings.autoStartNextSession}
          onChange={(event) => onUpdateSetting("autoStartNextSession", event.currentTarget.checked)}
          type="checkbox"
        />
        <span>Auto-start next</span>
      </label>
    </section>
  );
};
