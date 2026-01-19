#!/bin/bash -ex

#
docker container prune -f
docker image prune -af
docker volume prune -af
docker network prune -f

exit

# Kill all processes
ids="$(docker ps -a --format '{{.Image}},{{.ID}}' | grep ^demo_ | sed -e 's/.*,//')"
if [ -n "$ids" ]; then
  docker kill $ids
fi

exit

# Deletes all images. A clean-up script to start from scratch.


#latest="$(docker image ls --format "{{.ID}}" demo_ui:latest)"
# shellcheck disable=SC2046
for image in $(cd images && ls); do
  if [ -n "$(docker image ls --format '{{.ID}}' localhost:5000/${image})" ]; then
    docker image rm --force $(echo "$(docker image ls --format '{{.ID}}' localhost:5000/${image})")
  fi
  if [ -n "$(docker image ls --format '{{.ID}}' ${image})" ]; then
    docker image rm --force $(echo "$(docker image ls --format '{{.ID}}' ${image})")
  fi
done

docker container prune -f
docker image prune -f
docker volume prune -f

if [ -n "$(docker network ls --format '{{.Name}}' | grep demo_)" ]; then
  docker network rm $(docker network ls --format '{{.Name}}' | grep demo_)
fi

