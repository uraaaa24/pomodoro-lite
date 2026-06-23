import { invoke } from "@tauri-apps/api/core";
import { MODE_LABELS } from "./pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

const SOUND_DURATION_SECONDS = 0.32;
const FINISHED_FREQUENCIES: Record<PomodoroMode, number> = {
  focus: 660,
  shortBreak: 520,
  longBreak: 440,
};

let sharedAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  sharedAudioContext ??= new AudioContextConstructor();
  return sharedAudioContext;
};

export const prepareSessionCompleteSound = async () => {
  const audioContext = getAudioContext();

  if (!audioContext || audioContext.state !== "suspended") {
    return;
  }

  await audioContext.resume();
};

export const playSessionCompleteSound = async (completedMode: PomodoroMode) => {
  const audioContext = getAudioContext();

  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(FINISHED_FREQUENCIES[completedMode], now);
  oscillator.frequency.setValueAtTime(FINISHED_FREQUENCIES[completedMode] * 1.25, now + SOUND_DURATION_SECONDS / 2);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + SOUND_DURATION_SECONDS);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + SOUND_DURATION_SECONDS);
};

const isTauriRuntime = () => "__TAURI_INTERNALS__" in window;

export const requestDesktopNotificationPermission = async () => {
  if (isTauriRuntime()) {
    return "granted";
  }

  if (!("Notification" in window)) {
    return "denied";
  }

  if (window.Notification.permission !== "default") {
    return window.Notification.permission;
  }

  return window.Notification.requestPermission();
};

export const showSessionCompleteNotification = async (completedMode: PomodoroMode, nextMode: PomodoroMode) => {
  const completedLabel = MODE_LABELS[completedMode];
  const nextLabel = MODE_LABELS[nextMode];
  const title = `${completedLabel} complete`;
  const body = `Next up: ${nextLabel}.`;

  if (isTauriRuntime()) {
    try {
      await invoke("show_desktop_notification", { title, body });
      return;
    } catch (error) {
      console.error("Failed to show native desktop notification", error);
    }
  }

  if (!("Notification" in window) || window.Notification.permission !== "granted") {
    return;
  }

  new window.Notification(title, {
    body,
    tag: "pomodoro-lite-session-complete",
  });
};

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
    webkitAudioContext?: typeof AudioContext;
  }
}
