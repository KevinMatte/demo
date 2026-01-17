#!/bin/bash

mkdir -p /var/www/html/public /var/www/html/js
cp /mnt/version_data/image_versions.ish /var/www/html/public/
grep DEMO_VERSION /mnt/version_data/image_versions.ish | sed -e 's/=/="/' -e 's/$/"/' > /var/www/html/js/version.js
#chmod gou+read /var/www/html/js/version.js
if [ -z "$(mount | grep var/www)" ]; then
  chown -R www-data:www-data /var/www
fi
/usr/sbin/apachectl -D FOREGROUND
