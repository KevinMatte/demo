#!/bin/bash

mkdir -p /var/www/html/public /var/www/html/js
cp /mnt/version_data/image_versions.ish /var/www/html/public/
grep DEMO_VERSION /mnt/version_data/image_versions.ish | sed -e 's/=/="/' -e 's/$/"/' > /var/www/html/js/version.js
#chmod gou+read /var/www/html/js/version.js
chown -R www-data:www-data /var/www
/usr/sbin/apachectl -D FOREGROUND
