FROM ubuntu/apache2:edge
RUN apt update
RUN apt install -y php libapache2-mod-php
RUN apt install libapache2-mod-wsgi-py3 python3 -y
RUN apt install python3-markdown -y
RUN apt install -y curl
RUN a2enmod proxy
RUN a2enmod proxy_http

RUN rm /var/www/html/index.html
COPY build/ /

RUN chown -R www-data:www-data /var/www

CMD ["/root/bin/start.sh"]
