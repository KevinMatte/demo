#!/bin/bash -e

. bin/funcs.ish

# Lazily, create virtual environment for python scripts.
if [ \! -e bin/venv ]; then
    echo "Building bin/venv"
    python3 -m venv bin/venv
    . bin/venv/bin/activate
    pip install -r bin/requirements.txt
    say "Done"
fi

bin/dockerSetup.sh

# Start monitoring files for build.
bin/monitorBuild.sh


