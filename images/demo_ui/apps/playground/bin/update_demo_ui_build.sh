#!/bin/bash -e

echo "Adding playground apach2 site's locations"
sed -i -e '/# Locations/a\
    <Location "/api/demo_cpp/"> \
        ProxyPass "http://demo_cpp:8080/" \
    </Location> \
    <Location "/api/demo_java/"> \
        ProxyPass "http://demojava:8080/" \
    </Location> \
' \
  build/etc/apache2/sites-available/000-default.conf
