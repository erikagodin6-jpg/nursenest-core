import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { shouldShowPopup, suppressPopup } from "@/lib/popup-suppression";

const STORAGE_KEY = "nursenest-exit-intent-shown";
const POPUP_ID = "exit_intent";
const DELAY_MS = 15000;

export function useExitIntent() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const triggeredRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    if (user) return;

    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    const permanentlyDismissed = localStorage.getItem(STORAGE_KEY);
    if (alreadyShown || permanentlyDismissed) return;
    if (!shouldShowPopup(POPUP_ID)) return;

    const delayTimer = setTimeout(() => {
      readyRef.current = true;
    }, DELAY_MS);

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && readyRef.current && !triggeredRef.current) {
        triggeredRef.current = true;
        sessionStorage.setItem(STORAGE_KEY, "1");
        setShowModal(true);
      }
    }

    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;

    function handleScroll() {
      if (!readyRef.current || triggeredRef.current) return;

      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrolledPastHalf = currentY > docHeight * 0.4;

      if (currentY < lastScrollY && scrolledPastHalf) {
        scrollUpCount++;
        if (scrollUpCount >= 3) {
          triggeredRef.current = true;
          sessionStorage.setItem(STORAGE_KEY, "1");
          setShowModal(true);
        }
      } else {
        scrollUpCount = 0;
      }
      lastScrollY = currentY;
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(delayTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user]);

  function dismiss() {
    setShowModal(false);
  }

  function dismissForToday() {
    setShowModal(false);
    suppressPopup(POPUP_ID);
  }

  function dismissPermanently() {
    setShowModal(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  return { showModal, dismiss, dismissForToday, dismissPermanently };
}
