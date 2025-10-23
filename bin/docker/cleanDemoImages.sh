#!/bin/bash

# Lazily create src/docker/demo_version.txt
[ ! -f src/docker/demo_version.txt ] && echo "1.0.0" > src/docker/demo_version.txt

latest="$(docker image ls --format "{{.ID}}" demo:latest)"
# shellcheck disable=SC2046
docker image rm $(echo "$(docker image ls --format '{{.ID}}' demo | grep -v "$latest")")
