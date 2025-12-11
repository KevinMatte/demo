#!/bin/bash

if [ "$(basename $(pwd))" != "demo_mariadb" ]; then
  echo "In wrong directory: $(pwd)"
  exit 1
fi

PROJ_ROOT="$(git rev-parse --show-toplevel)"
. "${PROJ_ROOT}/.env"

rm -fr build
mkdir -p build/root
mkdir -p backup

cat > build/root/.my.cnf <<EOF
[client]
user=root
password=${MARIADB_ROOT_PASSWORD}
EOF
