#!/bin/bash -e

cd "$(dirname $0)/.."

while [ 1 = 1 ]; do
  targets="$(bin/python.sh bin/fileWatcher.py \
    build_static@src/static:.js,.jsx,.css,.html \
    build_front@src/front:.js,.jsx,.css,.html)
  "
  if :; then
      if [ -f build.locked ]; then
        echo "File build.locked exists. Waiting."
        while [ -f build.locked ]; do
          echo "Waiting for build.locked to go away"
          sleep 2
        done
      fi
      make ${targets} build_done
      echo "----------------------"
      date
      echo "======================"
  fi
done