#!/bin/bash

# Generates project's .env with secrets.
# Note: this script is monitored by `monitorBuild.sh` and re-run when changes found here


# Example secrets.env
# MARIADB_ROOT_PASSWORD="my_secret password"
source ./.secrets.env

cat <<EOF >${1:-.env}
PROJ_ROOT=$(git rev-parse --show-toplevel)

DEMO_UI_IMAGE=demo_ui
DEMO_UI_VERSION=$(cat images/demo_ui/src/docker/demo_version.txt)
DEMO_UI_WWW_PATH=$(pwd)/images/demo_ui/build/var/www

MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}
MARIADB_ADMINER_VERSION=5.4.1
MARIADB_BACKUP_PATH=$(pwd)/images/demo_mariadb/backup

DEMO_MARIADB_VERSION=1.0.0
EOF