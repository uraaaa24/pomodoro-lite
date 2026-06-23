import { FOCUS_MINUTES } from "../../lib/pomodoro";
import Panel from "../shared/panel";

type TodayFocusSummaryProps = {
  completedFocusSessions: number;
  onClose: () => void;
};

const MOCK_SESSION_GOAL = 4;
const MOCK_LAST_FOCUS_TIME = "14:35";

const summaryRowClassName = "grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5";
const summaryLabelClassName = "text-sm font-medium text-[#62645f]";
const summaryValueClassName = "font-['Geist_Mono'] text-sm font-medium tracking-[-0.03em] text-[#333432]";

const TodayFocusSummary = ({ completedFocusSessions, onClose }: TodayFocusSummaryProps) => {
  const completedToday = Math.min(completedFocusSessions, MOCK_SESSION_GOAL);
  const focusedMinutes = completedToday * FOCUS_MINUTES;
  const progressDots = Array.from({ length: MOCK_SESSION_GOAL }, (_, index) => index < completedToday);

  return (
    <Panel
      closeLabel="Close focus summary"
      labelledBy="today-focus-title"
      onClose={onClose}
      panelId="today-focus-panel"
      title="Today's focus"
    >
      <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] text-[#8a8d88] uppercase">
        Mock preview
      </p>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Focused time</span>
        <span className={summaryValueClassName}>{focusedMinutes} min</span>
      </div>
      <div className={summaryRowClassName}>
        <span className={summaryLabelClassName}>Sessions</span>
        <div className="flex items-center gap-2">
          <span className={summaryValueClassName}>
            {completedToday}/{MOCK_SESSION_GOAL}
          </span>
          <span
            className="flex gap-1.5"
            aria-label={`${completedToday} of ${MOCK_SESSION_GOAL} focus sessions complete`}
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
        <span className={summaryValueClassName}>
          {completedToday > 0 ? MOCK_LAST_FOCUS_TIME : "--:--"}
        </span>
      </div>
    </Panel>
  );
};

export default TodayFocusSummary;
