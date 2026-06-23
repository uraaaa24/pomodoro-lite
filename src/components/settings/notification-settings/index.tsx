import {
  requestDesktopNotificationPermission,
  showSessionCompleteNotification,
} from "../../../lib/session-cues";
import Button from "../../shared/button";
import SettingRow from "../../shared/setting-row";

const settingButtonGroupClassName =
  "grid min-w-[6.75rem] grid-flow-col auto-cols-fr gap-1.5 max-[360px]:col-start-2 max-[360px]:row-start-2 max-[360px]:w-full";

type NotificationSettingsProps = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
};

const NotificationSettings = ({ enabled, onEnabledChange }: NotificationSettingsProps) => {
  const handleNotificationChange = async (nextEnabled: boolean) => {
    if (!nextEnabled) {
      onEnabledChange(false);
      return;
    }

    const permission = await requestDesktopNotificationPermission();
    onEnabledChange(permission === "granted");
  };

  const handleTestNotification = async () => {
    const permission = await requestDesktopNotificationPermission();

    if (permission !== "granted") {
      onEnabledChange(false);
      return;
    }

    onEnabledChange(true);
    await showSessionCompleteNotification("focus", "shortBreak");
  };

  return (
    <SettingRow
      action={
        <div className={settingButtonGroupClassName}>
          <Button onClick={() => void handleTestNotification()} size="sm">
            Test
          </Button>
        </div>
      }
      checked={enabled}
      label="Notification"
      onChange={(checked) => void handleNotificationChange(checked)}
    />
  );
};

export default NotificationSettings;
