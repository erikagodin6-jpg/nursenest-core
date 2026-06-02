# Client-only modules

Components and utilities placed in this directory **must not** import server-only APIs (for example `next/headers` or authentication/session helpers). Keep all logic render-safe for client bundles.
