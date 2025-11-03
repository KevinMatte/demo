#!/bin/bash

if [ "$(basename $(pwd))" != "demo_java" ]; then
  echo "In wrong directory: $(pwd)"
  exit 1
fi

PROJ_ROOT="$(git rev-parse --show-toplevel)"
. "${PROJ_ROOT}/.env"

rm -fr build
