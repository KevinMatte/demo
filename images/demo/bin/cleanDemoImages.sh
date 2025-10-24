#!/bin/bash

latest="$(docker image ls --format "{{.ID}}" demo:latest)"
# shellcheck disable=SC2046
docker image rm -f $(echo "$(docker image ls --format '{{.ID}}' demo | grep -v "$latest")")
