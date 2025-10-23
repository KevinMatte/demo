#!/bin/bash -e

cd "$(dirname "$0")"/.. || exit

# Lazily create src/version.txt
[ ! -f src/version.txt ] && echo "1.0.0" > src/version.txt

docker build -t "demo" .
latest="$(docker image ls --format "{{.ID}}" demo:latest)"
last="$(docker image ls --format "{{.ID}}" demo:"$(cat src/version.txt)")"

if [ "$latest" != "$last" ]; then
  n="$(printf "%s" "$(cat src/version.txt | sed -e 's/[^.]//g')" | wc -m)";
  printf "%s.%s" \
    "$(cat src/version.txt | cut -d. -f1-"$n")" \
    "$(($(cat src/version.txt | cut -d. -f"$((n + 1))") + 1))" > src/version.txt
  cp src/version.txt build/var/www/html/

	# Rebuild with new version file.
  docker build -t "demo" .
	docker tag demo:latest "demo:$(cat src/version.txt)"
fi
