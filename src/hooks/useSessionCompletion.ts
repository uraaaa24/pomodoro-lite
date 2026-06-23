import { useEffect, useRef, useState } from "react";
import { MODE_LABELS } from "../lib/pomodoro";
import { playSessionStartSound, showSessionCompleteNotification } from "../lib/session-cues";
import type { PomodoroSettings } from "../lib/settings";
import type { CompletedSession } from "../types/pomodoro";

const INITIAL_STATUS_MESSAGE = "Ready to start a focus session.";

type UseSessionCompletionParams = {
  lastCompletedSession: CompletedSession | null;
  settings: PomodoroSettings;
};

export const useSessionCompletion = ({ lastCompletedSession, settings }: UseSessionCompletionParams) => {
  const handledSessionId = useRef<number | null>(null);
  const [statusMessage, setStatusMessage] = useState(INITIAL_STATUS_MESSAGE);

  useEffect(() => {
    if (!lastCompletedSession || handledSessionId.current === lastCompletedSession.id) {
      return;
    }

    handledSessionId.current = lastCompletedSession.id;
    setStatusMessage(
      `${MODE_LABELS[lastCompletedSession.completedMode]} complete. Next: ${MODE_LABELS[lastCompletedSession.nextMode]}.`,
    );

    if (settings.soundEnabled) {
      void playSessionStartSound(lastCompletedSession.nextMode, settings.soundVolume);
    }

    if (settings.desktopNotificationsEnabled) {
      void showSessionCompleteNotification(lastCompletedSession.completedMode, lastCompletedSession.nextMode);
    }
  }, [
    lastCompletedSession,
    settings.desktopNotificationsEnabled,
    settings.soundEnabled,
    settings.soundVolume,
  ]);

  return statusMessage;
};
