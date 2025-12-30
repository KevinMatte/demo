#!/bin/bash -e

cd $(dirname "$0")/..

# Lazily, create virtual environment for python scripts.
if [ \! -e bin/venv ]; then
    echo "Building bin/venv"
    python3 -m venv bin/venv
    . bin/venv/bin/activate
    pip install -r bin/requirements.txt
fi
