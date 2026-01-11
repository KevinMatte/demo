#!/bin/bash

cd $(dirname $0)/..

# Generates project's .env with secrets.
# Parameter: If 'bump' is first parameter, src/docker/image_versions.ish is bumped where the image ID has changed.
#
# Note: this script is monitored by `monitorBuild.sh` and re-run when changes found here

DEMO_UI_APPS="homepage playground spreadsheet_ts animation"

cat <<EOF >${1:-.env}
PROJ_ROOT=$(git rev-parse --show-toplevel)

DEMO_UI_IMAGE=demo_ui
DEMO_UI_WWW_PATH=$(pwd)/images/demo_ui/build/var/www
DEMO_UI_APPS="${DEMO_UI_APPS}"

DEMO_CPP_IMAGE=demo_cpp
DEMO_CPP_PORT=8080
DEMO_CPP_USER_NAME=demo_user
DEMO_CPP_USER_ID=2000
DEMO_CPP_GROUP_NAME=demo_user
DEMO_CPP_GROUP_ID=2000

DEMO_NODEJS_IMAGE=demo_nodejs
DEMO_NODEJS_PORT=3000
DEMO_NODEJS_USER_NAME=demo_user
DEMO_NODEJS_USER_ID=2000
DEMO_NODEJS_GROUP_NAME=demo_user
DEMO_NODEJS_GROUP_ID=2000

MARIADB_ADMINER_VERSION=5.4.1
MARIADB_BACKUP_PATH=$(pwd)/images/demo_mariadb/backup

$(cat ./.secrets.env)

$(cat src/docker/image_versions.ish | sed -e 's/ #.*//')
EOF

for m in $(ls -d images/*); do
  cp .env $m/.env
done

for app in ${DEMO_UI_APPS}; do
  cp .env images/demo_ui/apps/$app/.env
done
