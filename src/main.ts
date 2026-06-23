type TimerMode = "focus" | "shortBreak" | "longBreak";

type Durations = Record<TimerMode, number>;

const modeLabels: Record<TimerMode, string> = {
  focus: "作業セッション",
  shortBreak: "短い休憩",
  longBreak: "長い休憩",
};

const nextLabels: Record<TimerMode, string> = {
  focus: "短い休憩",
  shortBreak: "作業",
  longBreak: "作業",
};

const defaultDurations: Durations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

let durations = { ...defaultDurations };
let currentMode: TimerMode = "focus";
let remainingSeconds = durations.focus;
let completedFocusSessions = 0;
let isRunning = false;
let intervalId: number | undefined;

const timeDisplay = document.querySelector<HTMLTimeElement>("#time-display");
const sessionLabel = document.querySelector<HTMLElement>("#session-label");
const progressBar = document.querySelector<HTMLElement>("#progress-bar");
const toggleButton = document.querySelector<HTMLButtonElement>("#toggle-button");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");
const skipButton = document.querySelector<HTMLButtonElement>("#skip-button");
const completedCount = document.querySelector<HTMLElement>("#completed-count");
const cycleCount = document.querySelector<HTMLElement>("#cycle-count");
const nextSession = document.querySelector<HTMLElement>("#next-session");
const settingsForm = document.querySelector<HTMLFormElement>("#settings-form");
const modeTabs = document.querySelectorAll<HTMLButtonElement>(".mode-tab");

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function updateDocumentTitle() {
  document.title = `${formatTime(remainingSeconds)} - ${modeLabels[currentMode]} | Pomodoro Lite`;
}

function render() {
  const totalSeconds = durations[currentMode];
  const elapsedRatio = totalSeconds === 0 ? 0 : 1 - remainingSeconds / totalSeconds;

  if (timeDisplay) {
    timeDisplay.textContent = formatTime(remainingSeconds);
    timeDisplay.dateTime = `PT${remainingSeconds}S`;
  }

  if (sessionLabel) {
    sessionLabel.textContent = modeLabels[currentMode];
  }

  if (progressBar) {
    progressBar.style.width = `${Math.min(Math.max(elapsedRatio, 0), 1) * 100}%`;
  }

  if (toggleButton) {
    toggleButton.textContent = isRunning ? "一時停止" : "スタート";
  }

  if (completedCount) {
    completedCount.textContent = completedFocusSessions.toString();
  }

  if (cycleCount) {
    cycleCount.textContent = `${(completedFocusSessions % 4) + 1} / 4`;
  }

  if (nextSession) {
    nextSession.textContent = currentMode === "focus" && (completedFocusSessions + 1) % 4 === 0 ? "長い休憩" : nextLabels[currentMode];
  }

  modeTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === currentMode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  updateDocumentTitle();
}

function stopTimer() {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }

  isRunning = false;
}

function switchMode(mode: TimerMode) {
  stopTimer();
  currentMode = mode;
  remainingSeconds = durations[currentMode];
  render();
}

function goToNextMode() {
  const finishingFocus = currentMode === "focus";

  if (finishingFocus) {
    completedFocusSessions += 1;
  }

  const nextMode: TimerMode = finishingFocus
    ? completedFocusSessions % 4 === 0
      ? "longBreak"
      : "shortBreak"
    : "focus";

  switchMode(nextMode);
}

function tick() {
  remainingSeconds -= 1;

  if (remainingSeconds <= 0) {
    goToNextMode();
    return;
  }

  render();
}

function startTimer() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  intervalId = window.setInterval(tick, 1000);
  render();
}

function toggleTimer() {
  if (isRunning) {
    stopTimer();
    render();
    return;
  }

  startTimer();
}

function resetTimer() {
  stopTimer();
  remainingSeconds = durations[currentMode];
  render();
}

function readDurationInput(id: string, fallback: number) {
  const input = document.querySelector<HTMLInputElement>(id);
  const minutes = Number(input?.value);

  if (!Number.isFinite(minutes) || minutes < 1) {
    return fallback;
  }

  return Math.round(minutes) * 60;
}

function updateDurationsFromForm() {
  const previousTotal = durations[currentMode];

  durations = {
    focus: readDurationInput("#focus-minutes", defaultDurations.focus),
    shortBreak: readDurationInput("#short-break-minutes", defaultDurations.shortBreak),
    longBreak: readDurationInput("#long-break-minutes", defaultDurations.longBreak),
  };

  if (!isRunning && remainingSeconds === previousTotal) {
    remainingSeconds = durations[currentMode];
  } else if (remainingSeconds > durations[currentMode]) {
    remainingSeconds = durations[currentMode];
  }

  render();
}

function bindEvents() {
  toggleButton?.addEventListener("click", toggleTimer);
  resetButton?.addEventListener("click", resetTimer);
  skipButton?.addEventListener("click", goToNextMode);
  settingsForm?.addEventListener("input", updateDurationsFromForm);

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.dataset.mode as TimerMode | undefined;

      if (mode) {
        switchMode(mode);
      }
    });
  });
}

bindEvents();
render();
