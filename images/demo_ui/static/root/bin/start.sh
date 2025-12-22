#!/bin/bash

mkdir -p /var/www/html/public
cp /mnt/version_data/image_versions.ish /var/www/html/public/
grep DEMO_VERSION /mnt/version_data/image_versions.ish | sed -e 's/=/="/' -e 's/$/"/' > /var/www/html/public/version.js
#chmod gou+read /var/www/html/public/version.js
/usr/sbin/apachectl -D FOREGROUND
