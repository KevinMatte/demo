#!/bin/bash

cd "$(dirname $0)/.."

while [ 1 = 1 ]; do
  if bin/python.sh bin/monitorPath.py src,.js,.jsx,.css,.html; then
      make build_mounted
  fi
done