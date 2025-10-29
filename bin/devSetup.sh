#!/bin/bash -e

. bin/funcs.ish

if [ \! -e bin/venv ]; then
    echo "Building bin/venv"
    python3 -m venv bin/venv
    . bin/venv/bin/activate
    pip install -r bin/requirements.txt
    say "Done"
fi

if [ "$(lsof -i :5000 | wc -l)" = 0 ]; then
  say "Starting 5000:localhost:5000 tunnel"
  set -x
  ssh -Nf -L 5000:localhost:5000 demo_prod
else
  pids="$(lsof -i :5000  | tail -n -2 | sed -e 's/  */,/g' | cut -d, -f2 | sort -u)"
  set +e
  cmd="$(ps -f $pids  | tail -1 | grep -v "ssh -Nf -L 5000:localhost")"
  set -e
  if [ -n "$cmd" ]; then
    say -w "Port 5000 in use:"
    ps -f ${pids}
  else
    echo "Tunnel 5000:localhost:5000 tunnel already running."
  fi
fi

bin/monitorBuild.sh


