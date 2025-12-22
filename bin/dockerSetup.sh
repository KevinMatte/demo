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

 # If demo_prod host defined:
if grep -w demo_prod /etc/hosts > /dev/null; then
  # If there's no connection on port 5000 (Docker's repository)
  if [ "$(lsof -i :5000 | wc -l)" = 0 ]; then
    say "Starting 5000:localhost:5000 tunnel"
    set -x
    ssh -Nf -L 5000:localhost:5000 demo_prod
  else
    # Check what's using the port.
    pids="$(lsof -i :5000  | tail -n -2 | sed -e 's/  */,/g' | cut -d, -f2 | sort -u)"
    set +e
    cmd="$(ps -f $pids  | tail -1 | grep -v "ssh -Nf -L 5000:localhost")"
    set -e
    if [ -n "$cmd" ]; then
      # If not the expected ssh tunnel command, report it.
      say -w "Port 5000 in use:"
      ps -f ${pids}
    else
      # The ssh tunnel is already running.
      echo "Tunnel 5000:localhost:5000 tunnel already running."
    fi
  fi
else
  echo "Note: No demo_prod found in /etc/hosts."
fi

