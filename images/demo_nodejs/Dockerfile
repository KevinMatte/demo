FROM ubuntu:24.04
RUN apt update
RUN apt upgrade
RUN apt update
RUN apt install nodejs npm -y

COPY src/mnt/ /
COPY dist /home/_user_
COPY node_modules /home/_user_/node_modules
COPY package*.json tsconfig.json /home/_user_/
WORKDIR /root
CMD ["bin/startup.sh"]

