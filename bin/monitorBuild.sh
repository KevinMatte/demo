#!/bin/bash -e

cd "$(dirname $0)/.."
source bin/funcs.ish

say "Starting Monitor"
while [ 1 = 1 ]; do
  targets="$(bin/fileWatcher.py \
    '-C images/demo build_static@images/demo/src/static:.js,.jsx,.css,.html' \
    '-C images/demo build_front@images/demo/src/front:.jsx,.css,.html' \
    )"
  if :; then
      if [ -f tmp/build.locked ]; then
        say "File tmp/build.locked exists. Waiting."
        while [ -f tmp/build.locked ]; do
          say "Waiting for tmp/build.locked to go away"
          sleep 2
        done
      fi
      say "Making $(echo "${targets}" | sed -e 's/-C [^ ]* / /g')"
      make ${targets} build_done
      say -w "Done"
      echo "======================"
  fi
done