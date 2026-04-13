"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type UserFeedbackSurface = "learner" | "marketing";

type Ctx = {
  surface: UserFeedbackSurface;
  pathwayId: string | null;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const UserFeedbackContext = createContext<Ctx | null>(null);

export function UserFeedbackProvider({
  surface,
  pathwayId = null,
  children,
}: {
  surface: UserFeedbackSurface;
  pathwayId?: string | null;
  children: ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      surface,
      pathwayId: pathwayId?.trim() ? pathwayId : null,
      open,
      close,
      isOpen,
    }),
    [surface, pathwayId, open, close, isOpen],
  );

  return <UserFeedbackContext.Provider value={value}>{children}</UserFeedbackContext.Provider>;
}

export function useUserFeedback(): Ctx {
  const c = useContext(UserFeedbackContext);
  if (!c) {
    throw new Error("useUserFeedback must be used within UserFeedbackProvider");
  }
  return c;
}

export function useUserFeedbackOptional(): Ctx | null {
  return useContext(UserFeedbackContext);
}
