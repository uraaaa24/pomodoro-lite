# Pomodoro Lite Feature Roadmap

This roadmap focuses on features that make Pomodoro Lite feel reliable as a desktop timer before adding heavier productivity workflows.

## Recommended first milestone: session completion cues

Notification sound should be the first feature to add. A Pomodoro timer is only useful when it can pull the user's attention back at session boundaries, especially when the app is minimized or behind another window.

### Scope

- Play a short, pleasant sound when a focus, short break, or long break session finishes.
- Provide a mute toggle so users can keep the visual timer without audio.
- Use separate sound labels for work-finished and break-finished moments, even if the first implementation reuses the same audio asset.
- Keep the sound local and bundled with the app so it works offline.

### Acceptance criteria

- When the remaining time reaches zero, the app plays a completion sound once.
- The sound does not repeat while the timer is paused, reset, or manually switched.
- The mute setting is visible and can be changed without restarting the app.
- The app still advances to the next Pomodoro mode using the existing cycle rules.

## Near-term follow-up features

1. **Desktop notification**: Show a native notification alongside the sound so the user can see which session ended.
2. **Auto-start preference**: Let users choose whether the next focus or break starts automatically.
3. **Persistent settings**: Save custom durations, mute state, and auto-start behavior between launches.
4. **Session history**: Track completed focus sessions for the current day to make progress visible.
5. **Task label**: Allow a lightweight text label for the current focus session without turning the app into a full task manager.

## Features to defer

- Accounts, sync, or cloud backups.
- Detailed analytics dashboards.
- Project management integrations.
- Complex theme marketplaces.

These can be valuable later, but they add maintenance cost before the core timer experience is polished.
