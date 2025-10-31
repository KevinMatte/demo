FROM ubuntu:24.04
RUN apt update
RUN apt install -y mariadb-client
RUN useradd -m -d /home/kevin kevin
COPY build/ /home/kevin
RUN chown -R kevin:kevin /home/kevin
USER kevin
WORKDIR /home/kevin
CMD ["./demo_cpp"]