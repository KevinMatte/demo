#!/bin/bash

cat <<EOF >${1:-.env}
DEMO_IMAGE="demo_ui"
DEMO_VERSION="$(cat images/demo_ui/src/docker/demo_version.txt)"
WWW_PATH="$(pwd)/images/demo_ui/build/var/www"
EOF