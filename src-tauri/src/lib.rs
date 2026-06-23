use std::process::Command;

#[tauri::command]
fn show_desktop_notification(title: String, body: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let script = format!(
            "display notification {} with title {}",
            escape_apple_script_string(&body),
            escape_apple_script_string(&title)
        );
        return run_notification_command(Command::new("osascript").args(["-e", &script]));
    }

    #[cfg(target_os = "linux")]
    {
        return run_notification_command(Command::new("notify-send").args([&title, &body]));
    }

    #[cfg(target_os = "windows")]
    {
        let script = format!(
            "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null; "
                .to_owned()
                + "$template = [Windows.UI.Notifications.ToastTemplateType]::ToastText02; "
                + "$xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent($template); "
                + "$text = $xml.GetElementsByTagName('text'); "
                + "$text.Item(0).AppendChild($xml.CreateTextNode({:?})) > $null; "
                + "$text.Item(1).AppendChild($xml.CreateTextNode({:?})) > $null; "
                + "$toast = [Windows.UI.Notifications.ToastNotification]::new($xml); "
                + "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Pomodoro Lite').Show($toast);",
            title, body
        );
        return run_notification_command(Command::new("powershell").args([
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            &script,
        ]));
    }

    #[allow(unreachable_code)]
    Err("Desktop notifications are not supported on this platform.".to_string())
}

fn run_notification_command(command: &mut Command) -> Result<(), String> {
    let status = command
        .status()
        .map_err(|error| format!("Failed to run notification command: {error}"))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!("Notification command exited with status: {status}"))
    }
}

#[cfg(target_os = "macos")]
fn escape_apple_script_string(value: &str) -> String {
    format!("\"{}\"", value.replace('\\', "\\\\").replace('\"', "\\\""))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![show_desktop_notification])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
