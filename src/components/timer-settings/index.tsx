import type { PomodoroSettings } from "../../lib/settings";
import AutoStartSetting from "../settings/auto-start-setting";
import NotificationSettings from "../settings/notification-settings";
import SettingsPanelHeader from "../settings/settings-panel-header";
import SoundSettings from "../settings/sound-settings";

type TimerSettingsProps = {
  settings: PomodoroSettings;
  onClose: () => void;
  onUpdateSetting: <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => void;
};

const TimerSettings = ({ settings, onClose, onUpdateSetting }: TimerSettingsProps) => {
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
      <SettingsPanelHeader onClose={onClose} />
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
    </section>
  );
};

export default TimerSettings;
