#!/bin/bash

docker compose stop demo_mariadb

set -ex
docker compose run demo_mariadb mariadb-backup --prepare --target-dir=/backup/
docker compose run demo_mariadb bash -c "rm -fr /var/lib/mysql/* /var/lib/mysql/.*"
docker compose run demo_mariadb mariadb-backup --copy-back --target-dir=/backup/
docker compose start demo_mariadb
