# apache/beam_python3.12_sdk

# docker run --rm -dit --name demo -p 8080:80 -v /home/kevin/dev/demo/www:/usr/local/apache2/htdocs demo
# docker exec -it demo bash

FROM ubuntu/apache2:edge
RUN apt update
RUN apt install -y php libapache2-mod-php
RUN apt install libapache2-mod-wsgi-py3 python3 -y
RUN apt install python3-markdown -y

COPY ./src/etc/apache2 /etc/apache2
RUN ln -s /etc/apache2/sites-available/myapp.conf /etc/apache2/sites-enabled/myapp.conf
RUN rm /etc/apache2/sites-enabled/000-default.conf
COPY ./src/www /var/www
RUN chown -R www-data:www-data /var/www
RUN chmod o+x /var/www/html/myapp/myapp.py
