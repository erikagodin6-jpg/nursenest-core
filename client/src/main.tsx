import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
(window as any).__reactRendered = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              const event = new CustomEvent("sw-update-available");
              window.dispatchEvent(event);
            }
          });
        });
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
        try {
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "sw_error", {
              event_category: "pwa",
              event_label: err?.message || "registration_failed",
            });
          }
        } catch {}
      });

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SW_UPDATED") {
        const updateEvent = new CustomEvent("sw-update-available");
        window.dispatchEvent(updateEvent);
      }
    });
  });
}

if (typeof (window as any).gtag === "function") {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone;
  if (isStandalone) {
    (window as any).gtag("event", "pwa_app_open", {
      event_category: "pwa",
      event_label: "standalone",
    });
  }
}
