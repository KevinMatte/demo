#!/bin/bash

# Generates project's .env with secrets.
# Note: this script is monitored by `monitorBuild.sh` and re-run when changes found here


# Example secrets.env
# MARIADB_ROOT_PASSWORD="my_secret password"
source ./.secrets.env

cat <<EOF >${1:-.env}
PROJ_ROOT=$(git rev-parse --show-toplevel)

DEMO_UI_IMAGE=demo_ui
DEMO_UI_VERSION=$(cat src/docker/demo_version.txt)
DEMO_UI_WWW_PATH=$(pwd)/images/demo_ui/build/var/www

DEMO_CPP_IMAGE=demo_cpp
DEMO_CPP_VERSION=$(cat src/docker/demo_version.txt)
DEMO_CPP_PORT=8080
DEMO_CPP_USER_NAME=demo_user
DEMO_CPP_USER_ID=2000
DEMO_CPP_GROUP_NAME=demo_user
DEMO_CPP_GROUP_ID=2000

MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}
MARIADB_ADMINER_VERSION=5.4.1
MARIADB_BACKUP_PATH=$(pwd)/images/demo_mariadb/backup
DEMO_MARIADB_VERSION=$(cat src/docker/demo_version.txt)

DEMO_JAVA_VERSION=$(cat src/docker/demo_version.txt)
DEMO_JAVA_TOMCAT_ADMIN=admin
DEMO_JAVA_TOMCAT_MANAGER=manager
DEMO_JAVA_TOMCAT_MANAGER_PASSWORD=${DEMO_JAVA_TOMCAT_MANAGER_PASSWORD}

EOF