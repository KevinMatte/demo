#!/bin/bash -e

# Bumps all version numbers in src/docker/image_versions.ish where the docker image ID has changed.

cd $(dirname "$0")/.. || exit 0

bumpVersions() {
  [ ! -f src/docker/image_versions.ish ] && touch src/docker/image_versions.ish

  rm -f "tmp/image_versions.ish"
  touch "tmp/image_versions.ish"
  for image in $(cd images && ls); do
    versionVar="${image^^}_VERSION"
    dateVar="${image^^}_DATE"
    versionLine="$(grep "^${versionVar}" src/docker/image_versions.ish)" || versionLine="${versionVar}=1.0.0 #0#0"
    lastVersion="$(echo $versionLine | cut -d= -f2 | cut -d' ' -f1)"
    lastID="$(echo $versionLine | cut -d= -f2 | cut -d'#' -f2)"
    lastDate="$(echo $versionLine | cut -d= -f2 | cut -d'#' -f3)"
    latestID="$(docker image ls --format "{{.ID}}" ${image}:latest)"

      echo "old: ${image} ${dateVar}='${lastDate}': ${versionLine}"
    if [ "$latestID" != "$lastID" ]; then
      n="$(printf "%s" "$(echo "${lastVersion}" | sed -e 's/[^.]//g')" | wc -m)";
      majorPart="$(echo "${lastVersion}" | cut -d. -f1-"$n")"
      minorPart="$(echo "${lastVersion}" | cut -d. -f"$((n + 1))")"
      minorPart="$((minorPart + 1))"
      version="${majorPart}.${minorPart}"
      now="$(date +'%Y/%m/%d %H:%M:%S')"
      newLine="$(printf "%s=%s #%s#%s" "${versionVar}" "${version}" "${latestID}" "${now}")"
      echo "$newLine" >> tmp/image_versions.ish
      echo "${dateVar}='${now}'" >> tmp/image_versions.ish
      echo "new: ${image} ${dateVar}='${now}': ${newLine}"
    else
      echo "${versionLine}" >> tmp/image_versions.ish
      echo "${dateVar}='${lastDate}'" >> tmp/image_versions.ish
      version="${lastVersion}"
      now="${lastDate}"
    fi
    eval "export ${versionVar}=${version}"
    eval "export ${dateVar}=${version}"

  done
  mv "tmp/image_versions.ish" "src/docker/image_versions.ish"
}

bumpVersions

