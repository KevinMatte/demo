#!/bin/bash

echo "Building: ${@}"
touch $(PROJ_ROOT)/tmp/build.locked

apps="$(echo "$@" | grep /apps/ | sed -e 's#.*/apps/##' | sed -e 's#/.*##' | sort -u)"
for app in $apps; do
  make -C apps/${app} build;
  tar cf - -C apps/${app}/build . | (cd build; tar xvf -);
done

bin/update_build.sh
for app in $apps; do
  if [ -e apps/${app}/bin/update_demo_ui_build.sh ]; then
      echo "${app}";
      apps/${app}/bin/update_demo_ui_build.sh;
  fi
done

echo "Built: $apps"
echo "==================================================="
