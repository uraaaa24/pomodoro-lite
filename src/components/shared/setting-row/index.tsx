import type { ReactNode } from "react";

const checkboxClassName =
  "m-0 h-[1.1rem] w-[1.1rem] accent-[#a8d5ba] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8d5ba]";

const settingRowClassName =
  "grid min-h-11 grid-cols-[1.25rem_minmax(6rem,1fr)_auto] items-center gap-2.5 max-[360px]:grid-cols-[1.25rem_1fr]";

const settingLabelClassName = "flex min-w-0 items-center text-sm font-medium text-[#62645f]";

const iconToggleClassName = "flex min-w-0 items-center justify-center gap-0 text-sm font-medium text-[#62645f]";

type SettingCheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

const SettingCheckbox = ({ checked, label, onChange }: SettingCheckboxProps) => (
  <label className={iconToggleClassName}>
    <input
      checked={checked}
      className={checkboxClassName}
      onChange={(event) => onChange(event.currentTarget.checked)}
      type="checkbox"
    />
    <span className="sr-only">{label}</span>
  </label>
);

type SettingRowProps = {
  action?: ReactNode;
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

const SettingRow = ({ action, checked, label, onChange }: SettingRowProps) => (
  <div className={action ? settingRowClassName : "grid min-h-11 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-2.5"}>
    <SettingCheckbox checked={checked} label={label} onChange={onChange} />
    <span className={settingLabelClassName}>{label}</span>
    {action}
  </div>
);

export default SettingRow;
export { settingLabelClassName };
