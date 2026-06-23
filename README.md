# Pomodoro Lite

Pomodoro Lite is a small Tauri + Vanilla TypeScript timer for alternating between focused work and intentional breaks.

## Features

- 25-minute focus sessions, 5-minute short breaks, and 15-minute long breaks by default.
- Automatic long break after every fourth completed focus session.
- Start, pause, reset, and skip controls.
- Editable durations so the timer can be adapted to your study or work rhythm.
- Progress, completed-session count, current cycle, and next-session indicators.

## Roadmap

The implemented usability baseline adds session completion cues: sound, optional desktop notifications, auto-start preference, and locally persisted timer preferences. See [the feature roadmap](docs/feature-roadmap.md) for follow-up priorities.

## Development

Install dependencies, then run the Vite dev server:

```bash
npm install
npm run dev
```

Build the web assets with:

```bash
npm run build
```

Run the desktop app with Tauri:

```bash
npm run tauri dev
```
