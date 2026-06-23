# Pomodoro Lite

Pomodoro Lite is a small Tauri + Vanilla TypeScript timer for alternating between focused work and intentional breaks.

## Features

- 25-minute focus sessions, 5-minute short breaks, and 15-minute long breaks by default.
- Automatic long break after every fourth completed focus session.
- Start, pause, reset, and skip controls.
- Editable durations so the timer can be adapted to your study or work rhythm.
- Progress, completed-session count, current cycle, and next-session indicators.

## Roadmap

The next recommended milestone is session completion cues, starting with a bundled notification sound and mute toggle. See [the feature roadmap](docs/feature-roadmap.md) for scope and follow-up priorities.

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
