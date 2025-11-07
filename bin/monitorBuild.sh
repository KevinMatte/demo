#!/bin/bash

cd "$(dirname $0)/.."
source bin/funcs.ish

say "Starting Monitor"
while [ 1 = 1 ]; do
  commands="$(bin/fileWatcher.py \
    "make update_dot_env; make -C images/demo_ui build_static@ \
          images/demo_ui/src/static : .js,.jsx,.css,.html,.py,.php \
          .env .secrets.env" \
    "make -C images/demo_ui build_front@images/demo_ui/src/front:.jsx,.css,.html" \
    )"

  if :; then
      if [ -f tmp/build.locked ]; then
        say "File tmp/build.locked exists. Waiting."
        while [ -f tmp/build.locked ]; do
          say "Waiting for tmp/build.locked to go away"
          sleep 2
        done
      fi
      say "$(echo "${commands}" | sed -e "s/-C [^ ]* / /g")"
      if eval "${commands}"; then
        make build_done
        say -w "Done"
      else
        make build_done
        say -w "Error in Makefile"
      fi
      echo "======================"
  fi
done