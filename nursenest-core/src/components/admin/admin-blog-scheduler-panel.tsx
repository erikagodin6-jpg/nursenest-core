async function patchPost(id: string, payload: Record<string, unknown>) {
  setBusyId(id);
  setActionError(null);

  try {
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      setActionError(`Server returned non-JSON response (HTTP ${res.status})`);
      return;
    }

    if (!res.ok) {
      const messages: string[] = [];

      if (json?.error) messages.push(json.error);

      if (Array.isArray(json?.reasons)) {
        messages.push(...json.reasons);
      }

      if (Array.isArray(json?.prePublish?.blocking)) {
        messages.push(...json.prePublish.blocking.map((b: any) => b?.message).filter(Boolean));
      }

      if (json?.details?.fieldErrors) {
        for (const [field, errs] of Object.entries(json.details.fieldErrors)) {
          if (Array.isArray(errs)) {
            messages.push(...errs.map((e) => `${field}: ${e}`));
          }
        }
      }

      setActionError(messages.length ? messages.join(" | ") : `Request failed (${res.status})`);
      return;
    }

    router.refresh();
  } catch (e) {
    setActionError(e instanceof Error ? e.message : "Network error");
  } finally {
    setBusyId(null);
  }
}