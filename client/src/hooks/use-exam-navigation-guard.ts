import { useEffect, useCallback, useRef, useState } from "react";

export type ExamGuardMode = "cat" | "standard" | "practice" | "review";

interface ExamGuardOptions {
  isActive: boolean;
  mode: ExamGuardMode;
  onSubmitAndExit: () => void | Promise<void>;
}

export function useExamNavigationGuard({ isActive, mode, onSubmitAndExit }: ExamGuardOptions) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const isGuarded = isActive && (mode === "cat" || mode === "standard");
  const guardedRef = useRef(isGuarded);
  guardedRef.current = isGuarded;
  const pushCountRef = useRef(0);

  const onSubmitRef = useRef(onSubmitAndExit);
  onSubmitRef.current = onSubmitAndExit;

  useEffect(() => {
    if (!isGuarded) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGuarded]);

  useEffect(() => {
    if (!isGuarded) {
      pushCountRef.current = 0;
      return;
    }

    window.history.pushState({ examGuard: true }, "");
    pushCountRef.current = 1;

    const handlePopState = () => {
      if (!guardedRef.current) return;
      window.history.pushState({ examGuard: true }, "");
      pushCountRef.current++;
      setShowLeaveModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (pushCountRef.current > 0 && window.history.state?.examGuard) {
        window.history.back();
      }
      pushCountRef.current = 0;
    };
  }, [isGuarded]);

  const continueExam = useCallback(() => {
    setShowLeaveModal(false);
  }, []);

  const submitAndExit = useCallback(async () => {
    setShowLeaveModal(false);
    guardedRef.current = false;
    await onSubmitRef.current();
  }, []);

  return {
    showLeaveModal,
    continueExam,
    submitAndExit,
  };
}
