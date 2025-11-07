#!/bin/bash

cd "$(dirname $0)/.."
source bin/funcs.ish

say "Starting Monitor"
bin/fileWatcher.py -r --skip_file tmp/build.locked bin/monitorBuild.yaml
