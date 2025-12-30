#!/bin/bash -e

cd $(dirname "$0")/..

. bin/funcs.ish

./bin/initBuild.sh

bin/dockerSetup.sh

# Start monitoring files for build.
bin/monitorBuild.sh


