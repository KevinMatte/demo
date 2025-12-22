#!/bin/bash

echo "===================================="
echo "Building: ${@}"
echo "------------------------------------"
PROJ_ROOT="$(git rev-parse --show-toplevel)"
touch ${PROJ_ROOT}/tmp/build.locked

function extractExpr() {
  # Extracts from an array ($1) elements matching a regular expression ($3)
  # puts them in a destination array ($2) and removes them from the source array ($1)

  local name="$1"
  local dest="$2"
  local expr="$3"
  local arr
  eval arr="(\"\${$name[@]}\")"
  local tmp=/tmp/t.$$

  # Update destination array
  grep "${expr}" <( for f in "${arr[@]}"; do echo "$f"; done) >$tmp
  mapfile -t "${dest}" <$tmp

  # Update source array
  grep -v "${expr}" <(for f in "${arr[@]}"; do echo "$f"; done) >$tmp
  mapfile -t "${name}" <$tmp

  # Cleanup
  rm -f $tmp
}


changed_files=("$@")
extractExpr changed_files discard /build/
echo "changed_files: ${changed__files[@]}"

apps="$(grep "/apps/" <(for f in "$@"; do echo "$f"; done) | sed -e 's#.*/apps/##' | sed -e 's#/.*##' | sort -u)"
for app in $apps; do
  extractExpr changed_files app_files /apps/${app}/

  # Check for static files
  extractExpr app_files file_set /apps/${app}/static/
  [ -n "${file_set}" ] && make -C apps/${app} build_static;

  # Check for src files
  extractExpr app_files file_set /apps/${app}/src/
  [ -n "${file_set}" ] && make -C apps/${app} build_src;

  tar cf - -C apps/${app}/build . | (cd build; tar xf -);

  [ -n "${app_files}" ] && echo "${app}: No build for ${app_files[@]}" >&2
done

# Run demo_ui's update_build.sh
bin/update_build.sh

# Run all app's update_build.sh
for app in $apps; do
  if [ -e apps/${app}/bin/update_build.sh ]; then
      echo "${app}";
      apps/${app}/bin/update_build.sh;
  fi
done

echo "Built: $apps"
[ -n "${changed_files}" ] && echo "   No build for ${changed_files[@]}" >&2

echo "==================================================="
