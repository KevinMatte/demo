#!/bin/bash -e

cd $(dirname "$0")/..

. bin/funcs.ish

if [ ! -f .secrets.env ]; then
  ./bin/initBuild.sh
  ./bin/generateDotEnv.sh
elif [ ! -f .env ]; then
  ./bin/generateDotEnv.sh
fi

# Start monitoring files for build.
bin/monitorBuild.sh


