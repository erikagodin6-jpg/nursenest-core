# Server-only modules

Use this directory for utilities that require server runtime APIs (database clients, authentication helpers, `next/headers`, etc.). Keep client bundles free from these imports by exposing only narrow interfaces to the rest of the app.
