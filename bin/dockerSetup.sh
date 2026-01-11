#!/bin/bash -e

cd $(dirname "$0")/..

. bin/funcs.ish

# Lazily start docker engine (If not in Window's WSL)
if [ -n "${WSL_DISTRO_NAME}" ]; then
  :;
else
  if systemctl status docker | grep 'Active: active'; then
    :;
  else
    # Start docker by docker.socket, if it is running.
    docker ps >/dev/null 2>&1
  fi

  if systemctl status docker | grep 'Active: active'; then
  :;
  else
    echo sudo systemctl start docker
    sudo systemctl start docker
  fi
fi

bin/demoProdRepositoryTunnel.sh

