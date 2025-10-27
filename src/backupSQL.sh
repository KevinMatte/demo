#!/bin/bash

set -ex

docker compose exec demo_mariadb bash -c "rm -fr /backup/*"
docker compose exec demo_mariadb ls /backup
docker compose exec demo_mariadb mariadb-backup --backup --target-dir=/backup/
