#!/bin/bash

cd "$(dirname $0)/.."
source bin/funcs.ish

say "Starting Monitor"
while [ 1 = 1 ]; do
  targets="$(bin/fileWatcher.py \
    '-C images/demo_ui build_static@images/demo_ui/src/static:.js,.jsx,.css,.html,.py,.php' \
    '-C images/demo_ui build_static@.env' \
    '-C images/demo_ui build_front@images/demo_ui/src/front:.jsx,.css,.html' \
    '.env@bin/generateDotEnv.sh' \
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
      if make ${targets} build_done; then
        say -w "Done"
      else
        say -w "Error in Makefile"
      fi
      echo "======================"
  fi
done