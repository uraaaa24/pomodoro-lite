# Pomodoro Lite Feature Roadmap

This roadmap focuses on features that make Pomodoro Lite feel reliable as a desktop timer before adding heavier productivity workflows.

## Implemented usability baseline: session completion cues

Notification sound is the first implemented feature in this usability baseline. A Pomodoro timer is only useful when it can pull the user's attention back at session boundaries, especially when the app is minimized or behind another window.

### Scope

- Play a short, pleasant sound when a focus, short break, or long break session finishes.
- Provide a mute toggle so users can keep the visual timer without audio.
- Show an optional desktop notification when the app is minimized or behind another window.
- Provide an auto-start toggle for users who want the next session to begin immediately.
- Save cue preferences locally so the app remembers them between launches.

### Acceptance criteria

- When the remaining time reaches zero, the app plays a completion sound once.
- The sound does not repeat while the timer is paused, reset, or manually switched.
- The mute setting is visible and can be changed without restarting the app.
- The app still advances to the next Pomodoro mode using the existing cycle rules.

## Near-term follow-up features

1. **Session history**: Track completed focus sessions for the current day to make progress visible.
2. **Task label**: Allow a lightweight text label for the current focus session without turning the app into a full task manager.
3. **Editable sound choices**: Offer a small set of bundled tones once the default cue has been validated.
4. **Custom duration persistence**: Save edited focus, short-break, and long-break durations between launches.

## Features to defer

- Accounts, sync, or cloud backups.
- Detailed analytics dashboards.
- Project management integrations.
- Complex theme marketplaces.

These can be valuable later, but they add maintenance cost before the core timer experience is polished.
