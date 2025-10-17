#!/bin/bash

cd "$(dirname $0)"/.. || exit

# Lazily create src/www/html/version.txt
[ \! -f src/www/html/version.txt ] && echo "1.0.0" > src/www/html/version.txt

latest="$(docker image ls --format "{{.ID}}" demo:latest)"
docker image rm $(echo "$(docker image ls --format {{.ID}} demo | grep -v "$latest")")
