import "./tailwind.css";

type TimerMode = "focus" | "shortBreak" | "longBreak";

type Durations = Record<TimerMode, number>;

const modeLabels: Record<TimerMode, string> = {
  focus: "Focus Session",
  shortBreak: "Short Break",
  longBreak: "Long Break",
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
    toggleButton.textContent = isRunning ? "Pause" : "Start";
  }

  modeTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === currentMode;
    tab.classList.toggle("bg-[#C8E6D2]", isActive);
    tab.classList.toggle("text-[#2f302e]", isActive);
    tab.classList.toggle("bg-transparent", !isActive);
    tab.classList.toggle("text-[#8a8d88]", !isActive);
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

function bindEvents() {
  toggleButton?.addEventListener("click", toggleTimer);
  resetButton?.addEventListener("click", resetTimer);

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
