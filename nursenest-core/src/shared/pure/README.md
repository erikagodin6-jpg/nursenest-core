# Shared pure modules

Files in this directory must stay platform-agnostic: no imports from `next/headers`, authentication/session helpers, database clients, or other request-scoped APIs. Export only deterministic, side-effect-free helpers that run safely in every environment (build, edge, client, or server).
