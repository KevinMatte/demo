# apache/beam_python3.12_sdk

FROM ubuntu/apache2:edge
RUN apt update
RUN apt install -y php libapache2-mod-php
RUN apt install libapache2-mod-wsgi-py3 python3 -y
RUN apt install python3-markdown -y

COPY build/ /

RUN chown -R www-data:www-data /var/www
