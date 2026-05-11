#!/usr/bin/env node

const baseUrl = process.env.BASE_URL?.trim();
if (!baseUrl) {
  console.error("smoke:runtime-env requires BASE_URL (for example https://app.example.com)");
  process.exit(2);
}

const timeoutMs = Math.min(60_000, Math.max(3_000, Number(process.env.SMOKE_RUNTIME_TIMEOUT_MS ?? 15_000) || 15_000));
const normalizedBase = baseUrl.replace(/\/$/, "");

function isHtmlContentType(value) {
  return String(value ?? "").toLowerCase().includes("text/html");
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkHealthPath(pathname) {
  const url = `${normalizedBase}${pathname}`;
  const response = await fetchWithTimeout(url, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "application/json,text/plain;q=0.8,*/*;q=0.5" },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${pathname} returned HTTP ${response.status}`);
  }

  console.log(`[smoke:runtime-env] OK ${pathname} -> ${response.status}`);
}

async function checkHomepage() {
  const url = `${normalizedBase}/`;
  const response = await fetchWithTimeout(url, {
    method: "GET",
    redirect: "follow",
    headers: { Accept: "text/html,*/*;q=0.8" },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`/ returned HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (!isHtmlContentType(contentType)) {
    throw new Error(`/ returned unexpected content-type ${contentType ?? "(missing)"}`);
  }

  console.log(`[smoke:runtime-env] OK / -> ${response.status} ${contentType}`);
}

try {
  await checkHealthPath("/healthz");
  await checkHealthPath("/readyz");
  await checkHomepage();
  console.log("[smoke:runtime-env] PASS runtime env smoke endpoints responded successfully");
} catch (error) {
  console.error(
    `[smoke:runtime-env] FAIL ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}
