import { X } from "lucide-react";
import type { ReactNode } from "react";

import Button from "../button";

type PanelProps = {
  children?: ReactNode;
  closeLabel: string;
  labelledBy: string;
  onClose: () => void;
  panelId: string;
  title: string;
};

const panelClassName =
  "absolute top-15 right-2 z-10 grid w-[calc(100%-1rem)] max-w-[19.5rem] gap-2 rounded-2xl border border-[#e4e4e0] bg-white/95 p-3.5 text-left shadow-[0_1rem_3rem_rgb(47_48_46_/_12%)] backdrop-blur-md max-[360px]:right-0 max-[360px]:w-full";

const Panel = ({ children, closeLabel, labelledBy, onClose, panelId, title }: PanelProps) => (
  <section
    aria-labelledby={labelledBy}
    className={panelClassName}
    id={panelId}
    onKeyDown={(event) => {
      if (event.key === "Escape") {
        onClose();
      }
    }}
    role="dialog"
  >
    <div className="flex min-h-8 items-center justify-between gap-4">
      <h2 className="m-0 text-sm font-semibold text-[#333432]" id={labelledBy}>
        {title}
      </h2>
      <Button aria-label={closeLabel} autoFocus onClick={onClose} size="icon" variant="ghost">
        <X aria-hidden="true" size={18} strokeWidth={2} />
      </Button>
    </div>
    {children}
  </section>
);

export default Panel;
