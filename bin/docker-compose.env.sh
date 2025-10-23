#!/bin/bash

cat <<EOF >${1:-.env}
DEMO_IMAGE="demo"
DEMO_VERSION="$(cat src/version.txt)"
WWW_PATH="$(pwd)/build/var/www"
EOF