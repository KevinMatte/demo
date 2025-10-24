#!/bin/bash

cat <<EOF >${1:-.env}
DEMO_IMAGE="demo"
DEMO_VERSION="$(cat images/demo/src/docker/demo_version.txt)"
WWW_PATH="$(pwd)/images/demo/build/var/www"
EOF