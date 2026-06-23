import type { DailyFocusSummary } from "../../lib/daily-focus";
import Panel from "../shared/panel";

type TodayFocusSummaryProps = {
  onClose: () => void;
  summary: DailyFocusSummary;
};

const summaryRowClassName = "grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5";
const summaryLabelClassName = "text-sm font-medium text-[#62645f]";
const summaryValueClassName = "font-['Geist_Mono'] text-sm font-medium tracking-[-0.03em] text-[#333432]";

const TodayFocusSummary = ({ onClose, summary }: TodayFocusSummaryProps) => {
  return (
    <Panel
      closeLabel="Close focus summary"
      labelledBy="today-focus-title"
      onClose={onClose}
      panelId="today-focus-panel"
      title="Today's focus"
    >
      <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] text-[#8a8d88] uppercase">
        Saved for today
      </p>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Focused time</span>
        <span className={summaryValueClassName}>{summary.focusedMinutes} min</span>
      </div>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Sessions</span>
        <span className={summaryValueClassName}>{summary.completedFocusSessions} completed</span>
      </div>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Last focus</span>
        <span className={summaryValueClassName}>{summary.lastFocusFinishedAt ?? "--:--"}</span>
      </div>
    </Panel>
  );
};

export default TodayFocusSummary;
