#!/bin/bash -e

cd $(dirname "$0")/..

. bin/funcs.ish

./bin/initBuild.sh

# Start monitoring files for build.
bin/monitorBuild.sh


