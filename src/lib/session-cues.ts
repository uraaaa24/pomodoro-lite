import { invoke, isTauri } from "@tauri-apps/api/core";
import { MODE_LABELS } from "./pomodoro";
import type { PomodoroMode } from "../types/pomodoro";

type ChimeNote = {
  frequency: number;
  offsetSeconds: number;
  durationSeconds: number;
  level?: number;
};

const CHIME_GAIN = 1;
const NOTE_INTERVAL_SECONDS = 0.25;

const clampVolume = (volume: number) => Math.min(Math.max(volume, 0), 1);

const withEvenOffsets = (notes: Omit<ChimeNote, "offsetSeconds">[]): ChimeNote[] =>
  notes.map((note, index) => ({
    ...note,
    offsetSeconds: index * NOTE_INTERVAL_SECONDS,
  }));

const SESSION_TRANSITION_MOTIFS: Record<PomodoroMode, ChimeNote[]> = {
  focus: withEvenOffsets([
    { frequency: 523.25, durationSeconds: 0.18, level: 0.5 }, // C5
    { frequency: 659.25, durationSeconds: 0.18, level: 0.52 }, // E5
    { frequency: 783.99, durationSeconds: 0.22, level: 0.58 }, // G5
    { frequency: 659.25, durationSeconds: 0.2, level: 0.54 }, // E5
    { frequency: 880.0, durationSeconds: 0.55, level: 0.68 }, // A5
  ]),

  shortBreak: withEvenOffsets([
    { frequency: 783.99, durationSeconds: 0.2, level: 0.48 }, // G5
    { frequency: 659.25, durationSeconds: 0.18, level: 0.5 }, // E5
    { frequency: 587.33, durationSeconds: 0.2, level: 0.52 }, // D5
    { frequency: 523.25, durationSeconds: 0.22, level: 0.56 }, // C5
    { frequency: 659.25, durationSeconds: 0.5, level: 0.62 }, // E5
  ]),

  longBreak: withEvenOffsets([
    { frequency: 659.25, durationSeconds: 0.22, level: 0.46 }, // E5
    { frequency: 587.33, durationSeconds: 0.22, level: 0.48 }, // D5
    { frequency: 523.25, durationSeconds: 0.24, level: 0.52 }, // C5
    { frequency: 392.0, durationSeconds: 0.26, level: 0.54 }, // G4
    { frequency: 523.25, durationSeconds: 0.75, level: 0.64 }, // C5
  ]),
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

export const prepareSessionCueSound = async () => {
  const audioContext = getAudioContext();

  if (!audioContext || audioContext.state !== "suspended") {
    return;
  }

  await audioContext.resume();
};

export const playSessionStartSound = async (startedMode: PomodoroMode, volume = 1) => {
  const audioContext = getAudioContext();

  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();

  masterGain.gain.setValueAtTime(CHIME_GAIN * clampVolume(volume), now);
  masterGain.connect(audioContext.destination);

  SESSION_TRANSITION_MOTIFS[startedMode].forEach((note) => {
    playWoodenBell(audioContext, masterGain, note, now);
  });

  const chimeDurationMs = Math.max(
    ...SESSION_TRANSITION_MOTIFS[startedMode].map(
      (note) => (note.offsetSeconds + note.durationSeconds) * 1000,
    ),
  );
  window.setTimeout(() => masterGain.disconnect(), chimeDurationMs + 100);
};

const playWoodenBell = (
  audioContext: AudioContext,
  destination: AudioNode,
  { frequency, offsetSeconds, durationSeconds, level = 1 }: ChimeNote,
  baseTime: number,
) => {
  const startTime = baseTime + offsetSeconds;
  const endTime = startTime + durationSeconds;
  const body = audioContext.createOscillator();
  const shimmer = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const bodyGain = audioContext.createGain();
  const shimmerGain = audioContext.createGain();

  body.type = "sine";
  shimmer.type = "triangle";
  body.frequency.setValueAtTime(frequency, startTime);
  shimmer.frequency.setValueAtTime(frequency * 2.01, startTime);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, startTime);
  filter.frequency.exponentialRampToValueAtTime(1200, endTime);
  filter.Q.setValueAtTime(0.65, startTime);

  bodyGain.gain.setValueAtTime(0.0001, startTime);
  bodyGain.gain.exponentialRampToValueAtTime(level, startTime + 0.018);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, endTime);
  shimmerGain.gain.setValueAtTime(0.0001, startTime);
  shimmerGain.gain.exponentialRampToValueAtTime(level * 0.2, startTime + 0.012);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.13);

  body.connect(bodyGain);
  shimmer.connect(shimmerGain);
  bodyGain.connect(filter);
  shimmerGain.connect(filter);
  filter.connect(destination);

  body.start(startTime);
  shimmer.start(startTime);
  body.stop(endTime);
  shimmer.stop(startTime + 0.14);
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
