#!/bin/bash

# Deletes all images. A clean-up script to start from scratch.

#latest="$(docker image ls --format "{{.ID}}" demo_ui:latest)"
# shellcheck disable=SC2046
for image in $(cd images && ls); do
  docker image rm --force $(echo "$(docker image ls --format '{{.ID}}' localhost:5000/${image})")
done
