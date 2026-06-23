import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, readStoredSettings, writeStoredSettings, type PomodoroSettings } from "../lib/settings";

export const usePomodoroSettings = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    return readStoredSettings();
  });

  useEffect(() => {
    writeStoredSettings(settings);
  }, [settings]);

  const updateSetting = <Key extends keyof PomodoroSettings>(key: Key, value: PomodoroSettings[Key]) => {
    setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));
  };

  return { settings, updateSetting };
};
