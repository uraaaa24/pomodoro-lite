import { invoke, isTauri } from "@tauri-apps/api/core";
import { MODE_LABELS } from "./pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

const NOTE_DURATION_SECONDS = 0.42;
const NOTE_GAP_SECONDS = 0.12;
const CHIME_GAIN = 0.2;
const COMPLETION_CHIMES: Record<PomodoroMode, number[]> = {
  focus: [659.25, 783.99, 987.77],
  shortBreak: [523.25, 659.25, 783.99],
  longBreak: [440, 554.37, 659.25, 880],
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

  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();

  masterGain.gain.setValueAtTime(CHIME_GAIN, now);
  masterGain.connect(audioContext.destination);

  COMPLETION_CHIMES[completedMode].forEach((frequency, index) => {
    const startTime = now + index * (NOTE_DURATION_SECONDS + NOTE_GAP_SECONDS);
    playBellNote(audioContext, masterGain, frequency, startTime);
  });

  const chimeDurationMs =
    (COMPLETION_CHIMES[completedMode].length * (NOTE_DURATION_SECONDS + NOTE_GAP_SECONDS) + NOTE_DURATION_SECONDS) * 1000;
  window.setTimeout(() => masterGain.disconnect(), chimeDurationMs);
};

const playBellNote = (audioContext: AudioContext, destination: AudioNode, frequency: number, startTime: number) => {
  const endTime = startTime + NOTE_DURATION_SECONDS;
  const oscillator = audioContext.createOscillator();
  const harmonic = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  harmonic.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  harmonic.frequency.setValueAtTime(frequency * 2, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(1, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  harmonic.connect(gain);
  gain.connect(destination);

  oscillator.start(startTime);
  harmonic.start(startTime);
  oscillator.stop(endTime);
  harmonic.stop(endTime);
};

export const requestDesktopNotificationPermission = async () => {
  if (isTauri()) {
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

  if (isTauri()) {
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
    webkitAudioContext?: typeof AudioContext;
  }
}
