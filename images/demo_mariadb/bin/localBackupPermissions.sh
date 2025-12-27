#!/bin/bash

cd $(dirname $0)/.. || exit 1

sudo chgrp -R kevin backup
sudo chmod -R g+rw backup
sudo find backup -type d -print0 | sudo xargs -0 chmod g+x