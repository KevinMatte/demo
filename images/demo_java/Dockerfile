FROM tomcat:jre25-temurin-noble

RUN apt update
RUN apt install -y curl vim

RUN rmdir /usr/local/tomcat/webapps
RUN mv /usr/local/tomcat/webapps.dist /usr/local/tomcat/webapps
COPY build/ /
