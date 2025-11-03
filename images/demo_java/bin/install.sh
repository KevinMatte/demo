#!/bin/bash

sudo mkdir -p /usr/local/tomcat/bin
sudo chmod go+rw /usr/local/tomcat/bin
docker cp 'demo_java:/usr/local/tomcat/bin/bootstrap.jar' /usr/local/tomcat/bin/
docker cp 'demo_java:/usr/local/tomcat/bin/tomcat-juli.jar' /usr/local/tomcat/bin/
