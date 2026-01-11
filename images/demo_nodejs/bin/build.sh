#!/bin/bash

if [ "$(basename $(pwd))" != "demo_nodejs" ]; then
  echo "In wrong directory: $(pwd)"
  exit 1
fi

PROJ_ROOT="$(git rev-parse --show-toplevel)"
. "${PROJ_ROOT}/.env"

rm -fr dist node_modules
pnpm install
pnpm run build

