#!/bin/bash -e

PROJ_ROOT="$(git rev-parse --show-toplevel)"

echo "Updating build from src/static"
tar cf - -C src/static . | (cd build; tar xvf -)

echo "Setting static/version.txt"
. ${PROJ_ROOT}/.env;
echo ${DEMO_UI_VERSION} > build/var/www/html/static/version.txt;
set | grep '^DEMO_.*\(\(VERSION\)\|\(DATE\)\)' > build/var/www/html/static/versions.txt

