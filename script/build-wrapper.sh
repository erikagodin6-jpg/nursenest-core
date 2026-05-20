#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=4096"
exec npx tsx script/build.ts "$@"
