import { invoke, isTauri } from "@tauri-apps/api/core";
import { MODE_LABELS } from "./pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

type ChimeNote = {
  frequency: number;
  offsetSeconds: number;
  durationSeconds?: number;
};

const DEFAULT_NOTE_DURATION_SECONDS = 0.34;
const CHIME_GAIN = 0.16;
const COMPLETION_CHIMES: Record<PomodoroMode, ChimeNote[]> = {
  focus: [
    { frequency: 587.33, offsetSeconds: 0 },
    { frequency: 739.99, offsetSeconds: 0.16 },
    { frequency: 880, offsetSeconds: 0.32 },
    { frequency: 739.99, offsetSeconds: 0.52 },
    { frequency: 987.77, offsetSeconds: 0.72, durationSeconds: 0.48 },
  ],
  shortBreak: [
    { frequency: 659.25, offsetSeconds: 0 },
    { frequency: 587.33, offsetSeconds: 0.18 },
    { frequency: 493.88, offsetSeconds: 0.36 },
    { frequency: 587.33, offsetSeconds: 0.58, durationSeconds: 0.46 },
  ],
  longBreak: [
    { frequency: 493.88, offsetSeconds: 0 },
    { frequency: 587.33, offsetSeconds: 0.16 },
    { frequency: 659.25, offsetSeconds: 0.32 },
    { frequency: 739.99, offsetSeconds: 0.5 },
    { frequency: 880, offsetSeconds: 0.72, durationSeconds: 0.52 },
  ],
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

  COMPLETION_CHIMES[completedMode].forEach((note) => {
    playCozyPluck(audioContext, masterGain, note, now);
  });

  const chimeDurationMs = Math.max(
    ...COMPLETION_CHIMES[completedMode].map(
      (note) => (note.offsetSeconds + (note.durationSeconds ?? DEFAULT_NOTE_DURATION_SECONDS)) * 1000,
    ),
  );
  window.setTimeout(() => masterGain.disconnect(), chimeDurationMs + 100);
};

const playCozyPluck = (
  audioContext: AudioContext,
  destination: AudioNode,
  { frequency, offsetSeconds, durationSeconds = DEFAULT_NOTE_DURATION_SECONDS }: ChimeNote,
  baseTime: number,
) => {
  const startTime = baseTime + offsetSeconds;
  const endTime = startTime + durationSeconds;
  const body = audioContext.createOscillator();
  const woodenClick = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const bodyGain = audioContext.createGain();
  const clickGain = audioContext.createGain();

  body.type = "sine";
  woodenClick.type = "triangle";
  body.frequency.setValueAtTime(frequency, startTime);
  woodenClick.frequency.setValueAtTime(frequency * 3, startTime);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, startTime);
  filter.Q.setValueAtTime(0.8, startTime);

  bodyGain.gain.setValueAtTime(0.0001, startTime);
  bodyGain.gain.exponentialRampToValueAtTime(1, startTime + 0.018);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, endTime);
  clickGain.gain.setValueAtTime(0.0001, startTime);
  clickGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.01);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

  body.connect(bodyGain);
  woodenClick.connect(clickGain);
  bodyGain.connect(filter);
  clickGain.connect(filter);
  filter.connect(destination);

  body.start(startTime);
  woodenClick.start(startTime);
  body.stop(endTime);
  woodenClick.stop(startTime + 0.1);
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
