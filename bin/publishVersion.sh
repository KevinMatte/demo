#!/bin/bash -e

# Bumps all version numbers in src/docker/image_versions.ish where the docker image ID has changed.

if [ -z "$1" ]; then
  cd $(dirname "$0")/.. || exit 0
fi

TAR_FILE=${1:-tmp/version_data.tar}

docker kill version_update 2>/dev/null || :;
docker run -d --rm --name version_update --mount type=volume,src=version_data,dst=/mnt/version_data ubuntu:24.04 sleep 1000
docker exec version_update find /mnt/version_data -type f -delete
pwd
md5sum ${TAR_FILE}
docker cp ${TAR_FILE} version_update:/tmp/version_data.tar
docker exec version_update md5sum /tmp/version_data.tar
docker exec version_update tar xf /tmp/version_data.tar
docker kill version_update



