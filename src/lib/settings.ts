export type PomodoroSettings = {
  autoStartNextSession: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  desktopNotificationsEnabled: boolean;
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  autoStartNextSession: false,
  soundEnabled: true,
  soundVolume: 0.7,
  desktopNotificationsEnabled: false,
};

export const POMODORO_SETTINGS_STORAGE_KEY = "pomodoro-lite:settings";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const readVolume = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_SETTINGS.soundVolume;
  }

  return Math.min(Math.max(value, 0), 1);
};

export const readStoredSettings = (): PomodoroSettings => {
  try {
    const storedSettings = window.localStorage.getItem(POMODORO_SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsedSettings = JSON.parse(storedSettings) as Partial<PomodoroSettings>;

    return {
      autoStartNextSession: isBoolean(parsedSettings.autoStartNextSession)
        ? parsedSettings.autoStartNextSession
        : DEFAULT_SETTINGS.autoStartNextSession,
      soundEnabled: isBoolean(parsedSettings.soundEnabled) ? parsedSettings.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      soundVolume: readVolume(parsedSettings.soundVolume),
      desktopNotificationsEnabled: isBoolean(parsedSettings.desktopNotificationsEnabled)
        ? parsedSettings.desktopNotificationsEnabled
        : DEFAULT_SETTINGS.desktopNotificationsEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const writeStoredSettings = (settings: PomodoroSettings) => {
  window.localStorage.setItem(POMODORO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
