import { useEffect, useRef } from "react";
import {
  playSessionCompleteSound,
  prepareSessionCompleteSound,
  requestDesktopNotificationPermission,
  showSessionCompleteNotification,
} from "../lib/session-cues";
import type { PomodoroSettings } from "../lib/settings";

type TimerSettingsProps = {
  settings: PomodoroSettings;
  onClose: () => void;
  onUpdateSetting: <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => void;
};

export const TimerSettings = ({ settings, onClose, onUpdateSetting }: TimerSettingsProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleNotificationChange = async (enabled: boolean) => {
    if (!enabled) {
      onUpdateSetting("desktopNotificationsEnabled", false);
      return;
    }

    const permission = await requestDesktopNotificationPermission();
    onUpdateSetting("desktopNotificationsEnabled", permission === "granted");
  };

  const handleTestSound = async () => {
    await prepareSessionCompleteSound();
    await playSessionCompleteSound("focus");
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
      className="timer-settings"
      id="settings-panel"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="settings-panel-header">
        <h2 className="settings-title" id="settings-title">
          Preferences
        </h2>
        <button
          aria-label="Close settings"
          className="icon-button"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="setting-row">
        <label className="setting-toggle">
          <input
            checked={settings.soundEnabled}
            onChange={(event) => onUpdateSetting("soundEnabled", event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Sound</span>
        </label>
        <button className="setting-test-button" onClick={() => void handleTestSound()} type="button">
          Test
        </button>
      </div>
      <div className="setting-row">
        <label className="setting-toggle">
          <input
            checked={settings.desktopNotificationsEnabled}
            onChange={(event) => void handleNotificationChange(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Notification</span>
        </label>
        <button className="setting-test-button" onClick={() => void handleTestNotification()} type="button">
          Test
        </button>
      </div>
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
