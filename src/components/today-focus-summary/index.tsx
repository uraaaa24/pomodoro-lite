import type { DailyFocusSummary } from "../../lib/daily-focus";
import Panel from "../shared/panel";

type TodayFocusSummaryProps = {
  onClose: () => void;
  summary: DailyFocusSummary;
};

const SESSION_GOAL = 4;

const summaryRowClassName = "grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5";
const summaryLabelClassName = "text-sm font-medium text-[#62645f]";
const summaryValueClassName = "font-['Geist_Mono'] text-sm font-medium tracking-[-0.03em] text-[#333432]";

const TodayFocusSummary = ({ onClose, summary }: TodayFocusSummaryProps) => {
  const completedToday = Math.min(summary.completedFocusSessions, SESSION_GOAL);
  const progressDots = Array.from({ length: SESSION_GOAL }, (_, index) => index < completedToday);

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
        <div className="flex items-center gap-2">
          <span className={summaryValueClassName}>
            {summary.completedFocusSessions}/{SESSION_GOAL}
          </span>
          <span
            className="flex gap-1.5"
            aria-label={`${summary.completedFocusSessions} focus sessions completed today`}
          >
            {progressDots.map((isComplete, index) => (
              <span
                aria-hidden="true"
                className={
                  isComplete
                    ? "h-2.5 w-2.5 rounded-full bg-[#a8d5ba]"
                    : "h-2.5 w-2.5 rounded-full bg-[#e4e4e0]"
                }
                key={index}
              />
            ))}
          </span>
        </div>
      </div>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Last focus</span>
        <span className={summaryValueClassName}>{summary.lastFocusFinishedAt ?? "--:--"}</span>
      </div>
    </Panel>
  );
};

export default TodayFocusSummary;
