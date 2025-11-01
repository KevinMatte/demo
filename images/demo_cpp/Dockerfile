FROM ubuntu:24.04
RUN apt update
RUN apt install -y mariadb-client
COPY src/mnt/ /
COPY build/ /
COPY cmake_build/demo_cpp /home/_user_
WORKDIR /root
CMD ["bin/startup.sh"]