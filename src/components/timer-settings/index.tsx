import type { PomodoroSettings } from "../../lib/settings";
import Panel from "../shared/panel";
import AutoStartSetting from "../settings/auto-start-setting";
import NotificationSettings from "../settings/notification-settings";
import SoundSettings from "../settings/sound-settings";

type TimerSettingsProps = {
  settings: PomodoroSettings;
  onClose: () => void;
  onUpdateSetting: <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => void;
};

const TimerSettings = ({ settings, onClose, onUpdateSetting }: TimerSettingsProps) => {
  return (
    <Panel
      closeLabel="Close settings"
      labelledBy="settings-title"
      onClose={onClose}
      panelId="settings-panel"
      title="Preferences"
    >
      <SoundSettings
        enabled={settings.soundEnabled}
        onEnabledChange={(enabled) => onUpdateSetting("soundEnabled", enabled)}
        onVolumeChange={(volume) => onUpdateSetting("soundVolume", volume)}
        volume={settings.soundVolume}
      />
      <NotificationSettings
        enabled={settings.desktopNotificationsEnabled}
        onEnabledChange={(enabled) => onUpdateSetting("desktopNotificationsEnabled", enabled)}
      />
      <AutoStartSetting
        enabled={settings.autoStartNextSession}
        onEnabledChange={(enabled) => onUpdateSetting("autoStartNextSession", enabled)}
      />
    </Panel>
  );
};

export default TimerSettings;
