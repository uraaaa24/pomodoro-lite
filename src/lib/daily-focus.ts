export type DailyFocusSummary = {
  date: string;
  completedFocusSessions: number;
  focusedMinutes: number;
  lastFocusFinishedAt: string | null;
};

export const DAILY_FOCUS_STORAGE_KEY = "pomodoro-lite:daily-focus";

const isDailyFocusSummary = (value: unknown): value is DailyFocusSummary => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const summary = value as Partial<DailyFocusSummary>;

  return (
    typeof summary.date === "string" &&
    typeof summary.completedFocusSessions === "number" &&
    Number.isFinite(summary.completedFocusSessions) &&
    typeof summary.focusedMinutes === "number" &&
    Number.isFinite(summary.focusedMinutes) &&
    (summary.lastFocusFinishedAt === null || typeof summary.lastFocusFinishedAt === "string")
  );
};

export const getTodayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatLocalTime = (date = new Date()) => {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const createEmptyDailyFocusSummary = (date = getTodayKey()): DailyFocusSummary => ({
  date,
  completedFocusSessions: 0,
  focusedMinutes: 0,
  lastFocusFinishedAt: null,
});

export const readStoredDailyFocusSummary = (today = getTodayKey()): DailyFocusSummary => {
  try {
    const storedSummary = window.localStorage.getItem(DAILY_FOCUS_STORAGE_KEY);

    if (!storedSummary) {
      return createEmptyDailyFocusSummary(today);
    }

    const parsedSummary = JSON.parse(storedSummary) as unknown;

    if (!isDailyFocusSummary(parsedSummary) || parsedSummary.date !== today) {
      return createEmptyDailyFocusSummary(today);
    }

    return {
      date: parsedSummary.date,
      completedFocusSessions: Math.max(0, Math.floor(parsedSummary.completedFocusSessions)),
      focusedMinutes: Math.max(0, Math.floor(parsedSummary.focusedMinutes)),
      lastFocusFinishedAt: parsedSummary.lastFocusFinishedAt,
    };
  } catch {
    return createEmptyDailyFocusSummary(today);
  }
};

export const writeStoredDailyFocusSummary = (summary: DailyFocusSummary) => {
  window.localStorage.setItem(DAILY_FOCUS_STORAGE_KEY, JSON.stringify(summary));
};
