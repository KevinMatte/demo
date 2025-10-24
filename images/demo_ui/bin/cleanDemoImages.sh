#!/bin/bash

#latest="$(docker image ls --format "{{.ID}}" demo_ui:latest)"
# shellcheck disable=SC2046
docker image rm $(echo "$(docker image ls --format '{{.ID}}' localhost:5000/demo)")
