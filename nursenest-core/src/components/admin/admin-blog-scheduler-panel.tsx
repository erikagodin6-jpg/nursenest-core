async function patchPost(id: string, payload: Record<string, unknown>) {
  setBusyId(id);
  setActionError(null);

  try {
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const json = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const messages: string[] = [];

      if (typeof json?.error === "string") {
        messages.push(json.error);
      }

      if (Array.isArray(json?.reasons)) {
        messages.push(
          ...json.reasons
            .map((reason: unknown) => String(reason))
            .filter(Boolean),
        );
      }

      if (Array.isArray(json?.prePublish?.blocking)) {
        messages.push(
          ...json.prePublish.blocking
            .map((blocker: { message?: unknown }) =>
              typeof blocker?.message === "string" ? blocker.message : null,
            )
            .filter(Boolean),
        );
      }

      const fieldErrors = json?.details?.fieldErrors;
      if (fieldErrors && typeof fieldErrors === "object") {
        for (const [field, errs] of Object.entries(fieldErrors)) {
          if (Array.isArray(errs)) {
            messages.push(
              ...errs
                .map((err) => `${field}: ${String(err)}`)
                .filter(Boolean),
            );
          }
        }
      }

      if (!isJson) {
        messages.push(`Server returned non-JSON response (HTTP ${res.status})`);
      }

      setActionError(messages.length ? messages.join(" | ") : `Request failed (${res.status})`);
      return;
    }

    router.refresh();
  } catch (error) {
    setActionError(error instanceof Error ? error.message : "Network error");
  } finally {
    setBusyId(null);
  }
}