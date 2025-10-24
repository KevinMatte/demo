#!/bin/bash -e

# Lazily create src/docker/demo_version.txt
[ ! -f src/docker/demo_version.txt ] && echo "1.0.0" > src/docker/demo_version.txt

latest="$(docker image ls --format "{{.ID}}" demo:latest)"
last="$(docker image ls --format "{{.ID}}" demo:"$(cat src/docker/demo_version.txt)")"

if [ "$latest" != "$last" ]; then
  n="$(printf "%s" "$(cat src/docker/demo_version.txt | sed -e 's/[^.]//g')" | wc -m)";
  printf "%s.%s" \
    "$(cat src/docker/demo_version.txt | cut -d. -f1-"$n")" \
    "$(($(cat src/docker/demo_version.txt | cut -d. -f"$((n + 1))") + 1))" > src/docker/demo_version.txt
  cp src/docker/demo_version.txt build/var/www/html/
fi
