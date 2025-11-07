#!/bin/bash

if [ "$(basename $(pwd))" != "demo_java" ]; then
  echo "In wrong directory: $(pwd)"
  exit 1
fi

PROJ_ROOT="$(git rev-parse --show-toplevel)"
. "${PROJ_ROOT}/.env"

if [ \! -f jars/serlet-api.jar ]; then
  echo "Retrieving jars/servlet-api.jar"
  set -e
  id=$(docker run -d --rm --name get_serlet_api_jar tomcat:jre25-temurin-noble sleep 100)
  docker cp ${id}:/usr/local/tomcat/lib/servlet-api.jar jars/servlet-api.jar
  docker kill ${id}
  echo "  Done"
  set +e
fi

rm -fr build
mkdir -p build/var/www/html
echo ${DEMO_JAVA_VERSION} > build/var/www/html/version.txt
mkdir -p mount/usr/local/tomcat/conf
cat <<EOF >mount/usr/local/tomcat/conf/tomcat-users.xml
<?xml version="1.0" encoding="UTF-8"?>
<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
    <role rolename="manager-gui" />
    <user username="${DEMO_JAVA_TOMCAT_MANAGER}" password="${DEMO_JAVA_TOMCAT_MANAGER_PASSWORD}" roles="manager-gui" />

    <role rolename="admin-gui" />
    <user username="${DEMO_JAVA_TOMCAT_ADMIN}" password="${DEMO_JAVA_TOMCAT_MANAGER_PASSWORD}" roles="manager-gui,admin-gui" />
</tomcat-users>
EOF

mkdir -p build/usr/local/tomcat/webapps/MyApp/WEB-INF/classes
javac -d build/usr/local/tomcat/webapps/MyApp/WEB-INF/classes \
   -classpath jars/servlet-api.jar \
   src/HelloWorld.java
