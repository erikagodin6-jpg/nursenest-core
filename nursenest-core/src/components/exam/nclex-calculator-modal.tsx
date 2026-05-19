"use client";

import { X } from "lucide-react";
import { NclexCalculator } from "@/components/exam/nclex-calculator";

export function NclexCalculatorModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "5rem",
        background: "rgba(15,23,42,0.35)",
        backdropFilter: "blur(2px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Calculator"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close calculator"
          style={{
            position: "absolute",
            top: "-0.75rem",
            right: "-0.75rem",
            zIndex: 1,
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "50%",
            border: "none",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
          }}
        >
          <X size={12} />
        </button>
        <NclexCalculator onClose={onClose} />
      </div>
    </div>
  );
}
