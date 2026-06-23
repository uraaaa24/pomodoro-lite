import SettingRow from "../../shared/setting-row";

type AutoStartSettingProps = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
};

const AutoStartSetting = ({ enabled, onEnabledChange }: AutoStartSettingProps) => (
  <SettingRow checked={enabled} label="Auto-start next" onChange={onEnabledChange} />
);

export default AutoStartSetting;
