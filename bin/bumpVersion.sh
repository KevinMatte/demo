#!/bin/bash -e

cd $(dirname "$0")/.. || exit 0

# Bump all image versions.
bumpVersions() {
  [ ! -f src/docker/demo_version.txt ] && touch src/docker/demo_version.txt

  rm -f "tmp/demo_version.txt"
  touch "tmp/demo_version.txt"
  for image in $(cd images && ls); do
    versionVar="${image^^}_VERSION"
    versionLine="$(grep "^${versionVar}" src/docker/demo_version.txt)" || versionLine="${versionVar}=1.0.0 #0"
    lastVersion="$(echo $versionLine | cut -d= -f2 | cut -d' ' -f1)"
    lastID="$(echo $versionLine | cut -d= -f2 | cut -d'#' -f2)"
    latestID="$(docker image ls --format "{{.ID}}" ${image}:latest)"

    if [ "$latestID" != "$lastID" ]; then
      n="$(printf "%s" "$(echo "${lastVersion}" | sed -e 's/[^.]//g')" | wc -m)";
      majorPart="$(echo "${lastVersion}" | cut -d. -f1-"$n")"
      minorPart="$(echo "${lastVersion}" | cut -d. -f"$((n + 1))")"
      minorPart="$((minorPart + 1))"
      version="${majorPart}.${minorPart}"
      printf "%s=%s #%s\n" "${versionVar}" "${version}" "${latestID}" >> tmp/demo_version.txt
    else
      echo "${versionLine}" >> tmp/demo_version.txt
      version="${lastVersion}"
    fi
    eval "export ${versionVar}=${version}"
  done
  mv "tmp/demo_version.txt" "src/docker/demo_version.txt"
}

bumpVersions

