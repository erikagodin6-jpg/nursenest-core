"use client";

import { useState } from "react";

export default function BugReportButton({
  tenantId,
  userId,
  sessionId,
}: {
  tenantId: string;
  userId?: string;
  sessionId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    await fetch("/api/bug-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId,
        userId,
        sessionId,
        message,
        context: window.location.href,
      }),
    });

    setMessage("");
    setOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Report Bug
        </button>
      ) : (
        <div className="p-3 border rounded bg-white w-64">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 text-sm"
            placeholder="Describe the issue"
          />
          <button
            onClick={submit}
            className="mt-2 px-3 py-1 bg-black text-white w-full"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}