#!/bin/bash -e

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
cp -pr src/root build

sed -i \
  -e "s/TOMCAT_MANAGER/${DEMO_JAVA_TOMCAT_MANAGER}/g" \
  -e "s/TOMCAT_MANAGER_PASSWORD/${DEMO_JAVA_TOMCAT_MANAGER_PASSWORD}/g" \
  -e "s/TOMCAT_ADMIN/${DEMO_JAVA_TOMCAT_ADMIN}/g" \
  -e "s/TOMCAT_ADMIN_PASSWORD/${DEMO_JAVA_TOMCAT_ADMIN_PASSWORD}/g" \
  build/usr/local/tomcat/conf/tomcat-users.xml

echo ${DEMO_JAVA_VERSION} > build/var/www/html/version.txt

mkdir -p build/usr/local/tomcat/webapps/MyApp
cp -pr src/MyApp/WEB-INF build/usr/local/tomcat/webapps/MyApp
javac -d build/usr/local/tomcat/webapps/MyApp/WEB-INF/classes \
   -classpath jars/servlet-api.jar \
   src/MyApp/HelloWorld.java

   find build -name .gitignore -print0 | xargs -0 rm
