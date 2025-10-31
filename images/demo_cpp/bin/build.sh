#!/bin/bash

if [ "$(basename $(pwd))" != "demo_cpp" ]; then
  echo "In wrong directory: $(pwd)"
  exit 1
fi

PROJ_ROOT="$(git rev-parse --show-toplevel)"
. "${PROJ_ROOT}/.env"

mkdir -p build
cat > build/.my.cnf <<EOF
[client]
user=root
password=${MARIADB_ROOT_PASSWORD}
host=demo_mariadb
EOF
chmod go-rw build/.my.cnf
