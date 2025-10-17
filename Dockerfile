# apache/beam_python3.12_sdk

# docker run --rm -dit --name demo -p 8080:80 -v /home/kevin/dev/demo/www:/usr/local/apache2/htdocs demo
# docker exec -it demo bash


FROM drupalci/php-8.3-apache:production
COPY ./src/apache2/* /etc/apache2/
COPY ./src/www/html /var/www/html
# VOLUME /usr/local/apache2/htdocs
#COPY ./www /usr/local/apache2/htdocs/
