import { useState, useCallback } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";
import { shouldShowPopup } from "@/lib/popup-suppression";

const RATE_LIMIT_KEY = "last_upgrade_modal";
const POPUP_ID = "upgrade_modal";

function canShowModal(): boolean {
  try {
    if (!shouldShowPopup(POPUP_ID)) return false;
    const last = localStorage.getItem(RATE_LIMIT_KEY);
    if (!last) return true;
    const lastDate = new Date(last).toDateString();
    const today = new Date().toDateString();
    return lastDate !== today;
  } catch {
    return true;
  }
}

function markModalShown() {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, new Date().toISOString());
  } catch {
  }
}

export function useUpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, setTrigger] = useState("");

  const showUpgradeModal = useCallback((triggerName: string) => {
    if (!canShowModal()) return;
    setTrigger(triggerName);
    setIsOpen(true);
    markModalShown();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const UpgradeModalComponent = (
    <UpgradeModal isOpen={isOpen} onClose={handleClose} trigger={trigger} />
  );

  return { showUpgradeModal, UpgradeModalComponent };
}
