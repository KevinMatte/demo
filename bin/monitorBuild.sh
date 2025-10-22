#!/bin/bash -e

cd "$(dirname $0)/.."
source bin/funcs.ish

which gtts-cli mpg123 >/dev/null && can_speak=1 || can_speak=0

say "Starting Monitor"
while [ 1 = 1 ]; do
  targets="$(bin/python.sh bin/fileWatcher.py \
    build_static@src/static:.js,.jsx,.css,.html \
    build_front@src/front:.js,.jsx,.css,.html)
  "
  if :; then
      if [ -f build.locked ]; then
        say "File build.locked exists. Waiting."
        while [ -f build.locked ]; do
          say "Waiting for build.locked to go away"
          sleep 2
        done
      fi
      say "Making ${targets}"
      make ${targets} build_done
      say "Done"
      echo "======================"
  fi
done