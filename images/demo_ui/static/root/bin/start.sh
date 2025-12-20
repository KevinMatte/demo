#!/bin/bash

grep DEMO_VERSION /mnt/version_data/image_versions.ish | sed -e 's/=/="/' -e 's/$/"/' > /var/www/html/version.js
chmod gou+read /var/www/html/version.js
/usr/sbin/apachectl -D FOREGROUND
