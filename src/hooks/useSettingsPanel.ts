import { useEffect, useRef, useState } from "react";

export const useSettingsPanel = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true });

    return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const toggle = () => {
    setIsOpen((current) => !current);
  };

  return {
    buttonRef,
    close,
    isOpen,
    panelRef,
    toggle,
  };
};
