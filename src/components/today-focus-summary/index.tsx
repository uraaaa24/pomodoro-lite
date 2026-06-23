import { Coffee, Sparkles, X } from "lucide-react";

import { FOCUS_MINUTES } from "../../lib/pomodoro";
import Button from "../shared/button";

type TodayFocusSummaryProps = {
  completedFocusSessions: number;
  onClose: () => void;
};

const MOCK_SESSION_GOAL = 4;
const MOCK_LAST_FOCUS_TIME = "14:35";

const TodayFocusSummary = ({ completedFocusSessions, onClose }: TodayFocusSummaryProps) => {
  const completedToday = Math.min(completedFocusSessions, MOCK_SESSION_GOAL);
  const focusedMinutes = completedToday * FOCUS_MINUTES;
  const progressDots = Array.from({ length: MOCK_SESSION_GOAL }, (_, index) => index < completedToday);

  return (
    <section
      aria-labelledby="today-focus-title"
      className="absolute top-15 left-2 z-10 w-[calc(100%-1rem)] rounded-[1.75rem] border border-[#e4e4e0] bg-white/95 p-4 text-left shadow-[0_1rem_3rem_rgb(47_48_46_/_12%)] backdrop-blur-md max-[360px]:left-0 max-[360px]:w-full"
      id="today-focus-panel"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] text-[#8a8d88] uppercase">
            Mock preview
          </p>
          <h2
            className="mt-1 mb-0 text-sm font-semibold tracking-[-0.01em] text-[#333432]"
            id="today-focus-title"
          >
            Today&apos;s focus
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef7f2] text-[#5d9272]">
            <Sparkles aria-hidden="true" size={17} strokeWidth={2.2} />
          </span>
          <Button aria-label="Close focus summary" onClick={onClose} size="sm" variant="ghost">
            <X aria-hidden="true" size={15} strokeWidth={2.2} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <div>
          <p className="m-0 font-['Geist_Mono'] text-3xl leading-none font-medium tracking-[-0.05em] text-[#222222]">
            {focusedMinutes}
            <span className="ml-1 text-sm tracking-normal text-[#8a8d88]">min</span>
          </p>
          <p className="mt-1 mb-0 text-xs text-[#8a8d88]">
            {completedToday} of {MOCK_SESSION_GOAL} focus sessions complete
          </p>
        </div>
        <div
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
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#f7f7f5] px-3 py-2 text-xs text-[#696c66]">
        <Coffee aria-hidden="true" size={15} strokeWidth={2} />
        <span>Last focus finished at {completedToday > 0 ? MOCK_LAST_FOCUS_TIME : "--:--"}</span>
      </div>
    </section>
  );
};

export default TodayFocusSummary;
