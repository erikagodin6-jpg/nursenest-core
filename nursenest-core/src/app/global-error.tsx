"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8fafc", color: "#0f172a" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section
            style={{
              width: "100%",
              maxWidth: 520,
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              background: "#ffffff",
              padding: 32,
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <a href="/" style={{ display: "inline-block", marginBottom: 24, color: "#0f766e", fontWeight: 800 }}>
              NurseNest
            </a>

            <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>Just a moment</h1>

            <p style={{ marginTop: 12, color: "#475569", lineHeight: 1.6 }}>
              We hit a temporary issue loading the app. Try again in a moment.
            </p>

            {error?.digest ? (
              <p style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>
                Reference: {error.digest}
              </p>
            ) : null}

            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  border: 0,
                  borderRadius: 999,
                  background: "#0f766e",
                  color: "#ffffff",
                  padding: "10px 18px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>

              <a
                href="/"
                style={{
                  borderRadius: 999,
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  padding: "10px 18px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Go home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}