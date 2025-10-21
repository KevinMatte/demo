#!/bin/bash

cd "$(dirname "$0")"/.. || exit

# Lazily create src/version.txt
[ ! -f src/version.txt ] && echo "1.0.0" > src/version.txt

latest="$(docker image ls --format "{{.ID}}" demo:latest)"
# shellcheck disable=SC2046
docker image rm $(echo "$(docker image ls --format '{{.ID}}' demo | grep -v "$latest")")
