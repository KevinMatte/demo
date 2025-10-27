FROM gcc:15

RUN useradd -m -d /home/kevin kevin
COPY src/ /
RUN chown -R kevin:kevin /home/kevin
USER kevin
WORKDIR /home/kevin
RUN make -C server/src server
WORKDIR /home/kevin
CMD ["server/build/server"]