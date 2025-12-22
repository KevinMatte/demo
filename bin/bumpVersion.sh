#!/bin/bash -e

# Bumps all version numbers in src/docker/image_versions.ish where the docker image ID has changed.

NO_BUMP=0
while getopts "nx" opt; do
  case ${opt} in
    n)
      NO_BUMP=1
      ;;
    x)
      set -x
      ;;
    \?)
      echo "Invalid option: -${OPTARG}" >&2
      exit 1
      ;;
  esac
done

cd $(dirname "$0")/.. || exit 0

bumpVersion() {
  local lastVersion leftPart versionPart rightPart

  lastVersion="$1"
  field="${2:-3}"
  leftPart="$(echo "${lastVersion}" | cut -d. -f1-"$((field - 1))" 2>/dev/null)"
  versionPart="$(echo "${lastVersion}" | cut -d. -f"${field}")"
  rightPart="$(echo "${lastVersion}" | cut -d. -f"$((field + 1))-" 2>/dev/null)"
  versionPart="$((versionPart + 1))"
  [ -n "${rightPart}" ] && rightPart=".${rightPart}"
  [ -n "${leftPart}" ] && leftPart="${leftPart}."
  echo "${leftPart}${versionPart}${rightPart}"
}

declare -a updatedImages
appVersionField=99
appVersion="$(grep "^DEMO_VERSION" src/docker/image_versions.ish | sed -e 's/^.*=//' | sed -e 's/[^0-9.].*//')"
appVersion=${appVersion:-1.0.0}

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

    if [ "${NO_BUMP}" = 0 ] && [ "$latestID" != "$lastID" ]; then
      version=$(bumpVersion "$lastVersion")
      field=$(diff <(echo "${lastVersion}" | sed -e 's/\./\n/g') <(echo "${version}" | sed -e 's/\./\n/g') |
          grep -m 1 "[0-9][0-9]*c" |
          sed -e 's/[^0-9].*//'
        )
      [ ${field} -lt ${appVersionField} ] && appVersionField=${field}
      imageDate="$(date +'%Y/%m/%d %H:%M:%S')"
      newLine="$(printf "%s=%s #%s#%s" "${versionVar}" "${version}" "${latestID}" "${imageDate}")"
      echo "$newLine" >> tmp/image_versions.ish
      echo "${dateVar}='${imageDate}'" >> tmp/image_versions.ish
      echo "new: ${image} ${dateVar}='${imageDate}': ${newLine}"
      echo
      updatedImages+=" ${image}=${versionVar}"
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

  # Update DEMO_VERSION
  if [ "${NO_BUMP}" = 0 ] && [ "$appVersionField" != 99 ]; then
    appVersion=$(bumpVersion $appVersion ${appVersionField})
  fi
  echo "DEMO_VERSION=${appVersion}"  >> tmp/image_versions.ish

  # Update source and commit.
  mv "tmp/image_versions.ish" "src/docker/image_versions.ish"
  cp src/docker/image_versions.ish tmp/mnt/version_data/image_versions.ish

  # Save data for shared volume
  tar cf tmp/version_data.tar -C tmp mnt/version_data
}

bumpVersions
if [ ${#updatedImages} = 0 ]; then
  echo "No image version changed."
else
  echo "git commit -m "${updatedImages}" src/docker/image_versions.ish"
  git commit -m "${updatedImages}" src/docker/image_versions.ish
fi



