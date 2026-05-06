import React from "react";

/**
 * PRODUCTION HOTFIX:
 * Never replace the homepage with safe-mode.
 * If something fails, we still render a minimal real homepage instead.
 */
export function MarketingHomeEmergencyFallback() {
  return (
    <main style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>NurseNest</h1>
      <p>Canada-first nursing exam prep platform.</p>

      <div style={{ marginTop: "20px" }}>
        <a href="/login">Log in</a> |{" "}
        <a href="/signup">Start Free</a>
      </div>

      <div style={{ marginTop: "30px", opacity: 0.7 }}>
        <p>We’re updating the site right now. Core features are still available.</p>
      </div>
    </main>
  );
}