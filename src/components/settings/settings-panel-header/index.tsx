import { X } from "lucide-react";
import Button from "../../shared/button";

type SettingsPanelHeaderProps = {
  onClose: () => void;
};

const SettingsPanelHeader = ({ onClose }: SettingsPanelHeaderProps) => (
  <div className="flex min-h-8 items-center justify-between gap-4">
    <h2 className="m-0 text-sm font-semibold text-[#333432]" id="settings-title">
      Preferences
    </h2>
    <Button aria-label="Close settings" autoFocus onClick={onClose} size="icon" variant="ghost">
      <X aria-hidden="true" size={18} strokeWidth={2} />
    </Button>
  </div>
);

export default SettingsPanelHeader;
