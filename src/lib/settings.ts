export type PomodoroSettings = {
  autoStartNextSession: boolean;
  soundEnabled: boolean;
  desktopNotificationsEnabled: boolean;
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  autoStartNextSession: false,
  soundEnabled: true,
  desktopNotificationsEnabled: false,
};

export const POMODORO_SETTINGS_STORAGE_KEY = "pomodoro-lite:settings";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

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
