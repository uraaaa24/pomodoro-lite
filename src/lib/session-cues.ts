import { MODE_LABELS } from "./pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

const SOUND_DURATION_SECONDS = 0.24;
const FINISHED_FREQUENCIES: Record<PomodoroMode, number> = {
  focus: 660,
  shortBreak: 520,
  longBreak: 440,
};

export const playSessionCompleteSound = (completedMode: PomodoroMode) => {
  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  const audioContext = new AudioContextConstructor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(FINISHED_FREQUENCIES[completedMode], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + SOUND_DURATION_SECONDS);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + SOUND_DURATION_SECONDS);
  oscillator.addEventListener("ended", () => void audioContext.close());
};

export const requestDesktopNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return "denied";
  }

  if (window.Notification.permission !== "default") {
    return window.Notification.permission;
  }

  return window.Notification.requestPermission();
};

export const showSessionCompleteNotification = (completedMode: PomodoroMode, nextMode: PomodoroMode) => {
  if (!("Notification" in window) || window.Notification.permission !== "granted") {
    return;
  }

  const completedLabel = MODE_LABELS[completedMode];
  const nextLabel = MODE_LABELS[nextMode];

  new window.Notification(`${completedLabel} complete`, {
    body: `Next up: ${nextLabel}.`,
    tag: "pomodoro-lite-session-complete",
  });
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
