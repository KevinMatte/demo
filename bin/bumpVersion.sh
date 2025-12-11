#!/bin/bash -e

# Bumps all version numbers in src/docker/image_versions.ish where the docker image ID has changed.

cd $(dirname "$0")/.. || exit 0

bumpVersions() {
  [ ! -f src/docker/image_versions.ish ] && touch src/docker/image_versions.ish

  rm -f "tmp/image_versions.ish"
  touch "tmp/image_versions.ish"
  rm -fr tmp/mnt/version_data
  mkdir -p tmp/mnt/version_data
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
      imageDate="$(date +'%Y/%m/%d %H:%M:%S')"
      newLine="$(printf "%s=%s #%s#%s" "${versionVar}" "${version}" "${latestID}" "${imageDate}")"
      echo "$newLine" >> tmp/image_versions.ish
      echo "${dateVar}='${imageDate}'" >> tmp/image_versions.ish
      echo "new: ${image} ${dateVar}='${imageDate}': ${newLine}"
      echo
    else
      echo "${versionLine}" >> tmp/image_versions.ish
      echo "${dateVar}='${lastDate}'" >> tmp/image_versions.ish
      version="${lastVersion}"
      imageDate="${lastDate}"
    fi
    eval "export ${versionVar}=${version}"
    eval "export ${dateVar}='${imageDate}'"

    echo "${version}"  > tmp/mnt/version_data/${image}_version.txt
    echo "${imageDate}" > tmp/mnt/version_data/${image}_date.txt
  done
  mv "tmp/image_versions.ish" "src/docker/image_versions.ish"
  cp src/docker/image_versions.ish tmp/mnt/version_data/image_versions.ish
  tar cf tmp/version_data.tar -C tmp mnt/version_data
}

bumpVersions



