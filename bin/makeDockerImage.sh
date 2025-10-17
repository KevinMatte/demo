#!/bin/bash

cd "$(dirname $0)"/.. || exit

# Lazily create src/www/html/version.txt
[ ! -f src/www/html/version.txt ] && echo "1.0.0" > src/www/html/version.txt

docker build -t "demo" .
latest="$(docker image ls --format "{{.ID}}" demo:latest)"
last="$(docker image ls --format "{{.ID}}" demo:"$(cat src/www/html/version.txt)")"

if [ "$latest" != "$last" ]; then
  n="$(printf "%s" "$(cat src/www/html/version.txt | sed -e 's/[^.]//g')" | wc -m)";
  printf "%s.%s" \
    "$(cat src/www/html/version.txt | cut -d. -f1-"$n")" \
    "$(($(cat src/www/html/version.txt | cut -d. -f"$(($n + 1))") + 1))" > src/www/html/version.txt

	# Rebuild with new version file.
  docker build -t "demo" .
	docker tag demo:latest "demo:$(cat src/www/html/version.txt)"
	touch bin/demo.docker.timestamp
fi