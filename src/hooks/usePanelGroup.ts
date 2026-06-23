import { useEffect, useMemo, useRef, useState } from "react";

export type AppPanelId = "focusSummary" | "settings";

export const usePanelGroup = () => {
  const [openPanel, setOpenPanel] = useState<AppPanelId | null>(null);
  const focusSummaryButtonRef = useRef<HTMLButtonElement>(null);
  const focusSummaryPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  const buttonRefs = useMemo<Record<AppPanelId, typeof focusSummaryButtonRef>>(
    () => ({
      focusSummary: focusSummaryButtonRef,
      settings: settingsButtonRef,
    }),
    [],
  );

  const panelRefs = useMemo<Record<AppPanelId, typeof focusSummaryPanelRef>>(
    () => ({
      focusSummary: focusSummaryPanelRef,
      settings: settingsPanelRef,
    }),
    [],
  );

  useEffect(() => {
    if (!openPanel) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (buttonRefs[openPanel].current?.contains(target) || panelRefs[openPanel].current?.contains(target)) {
        return;
      }

      setOpenPanel(null);
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true });

    return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [buttonRefs, openPanel, panelRefs]);

  const close = (panelId: AppPanelId) => {
    setOpenPanel((currentPanel) => (currentPanel === panelId ? null : currentPanel));
    window.requestAnimationFrame(() => buttonRefs[panelId].current?.focus());
  };

  const getButtonRef = (panelId: AppPanelId) => buttonRefs[panelId];
  const getPanelRef = (panelId: AppPanelId) => panelRefs[panelId];
  const isOpen = (panelId: AppPanelId) => openPanel === panelId;

  const toggle = (panelId: AppPanelId) => {
    setOpenPanel((currentPanel) => (currentPanel === panelId ? null : panelId));
  };

  return {
    close,
    getButtonRef,
    getPanelRef,
    isOpen,
    toggle,
  };
};
