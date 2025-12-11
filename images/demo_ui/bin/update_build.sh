#!/bin/bash -e

PROJ_ROOT="$(git rev-parse --show-toplevel)"

echo "Updating build from static"
tar cf - -C static . | (cd build; tar xvf -)
