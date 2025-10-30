FROM ubuntu:24.04

RUN useradd -m -d /home/kevin kevin
COPY build/ /home/kevin
RUN chown -R kevin:kevin /home/kevin
USER kevin
WORKDIR /home/kevin
CMD ["/usr/bin/sleep", "1000"]
# CMD ["./demo_cpp"]