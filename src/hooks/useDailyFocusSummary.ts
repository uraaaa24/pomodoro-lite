import { useEffect, useState } from "react";

import {
  createEmptyDailyFocusSummary,
  formatLocalTime,
  getTodayKey,
  readStoredDailyFocusSummary,
  writeStoredDailyFocusSummary,
  type DailyFocusSummary,
} from "../lib/daily-focus";
import { FOCUS_MINUTES } from "../lib/pomodoro";
import type { CompletedSession } from "../types/pomodoro";

const DATE_CHECK_INTERVAL_MS = 60_000;

export const useDailyFocusSummary = (lastCompletedSession: CompletedSession | null) => {
  const [summary, setSummary] = useState<DailyFocusSummary>(() => {
    if (typeof window === "undefined") {
      return createEmptyDailyFocusSummary();
    }

    return readStoredDailyFocusSummary();
  });

  useEffect(() => {
    if (!lastCompletedSession || lastCompletedSession.completedMode !== "focus") {
      return;
    }

    setSummary(() => {
      const today = getTodayKey();
      const currentSummary = readStoredDailyFocusSummary(today);
      const nextSummary: DailyFocusSummary = {
        date: today,
        completedFocusSessions: currentSummary.completedFocusSessions + 1,
        focusedMinutes: currentSummary.focusedMinutes + FOCUS_MINUTES,
        lastFocusFinishedAt: formatLocalTime(),
      };

      writeStoredDailyFocusSummary(nextSummary);
      return nextSummary;
    });
  }, [lastCompletedSession]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSummary((currentSummary) => {
        const today = getTodayKey();

        if (currentSummary.date === today) {
          return currentSummary;
        }

        const nextSummary = createEmptyDailyFocusSummary(today);
        writeStoredDailyFocusSummary(nextSummary);
        return nextSummary;
      });
    }, DATE_CHECK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return summary;
};
