# Setup flask under apache2

[Deploying a Flask Application via the Apache Server](https://www.opensourceforu.com/2023/03/deploying-a-flask-application-via-the-apache-server/)

# Setup wsgi

```shell
sudo apt update -y
sudo apt upgrade -y
sudo apt install python3 libexpat1 -y
sudo apt install apache2 apache2-utils ssl-cert libapache2-mod-wsgi-py3 -y

```

## Configure mod_wsgi
```shell
sudo nano /var/www/html/wsgitest.py

```
```python
def application(environ, start_response):
    status = '200 OK'
    output = b'Hello from python!\n'

    response_headers = [
        ('Content-type', 'text/plain'),
        ('Content-Length', str(len(output)))
    ]

    start_response(status, response_headers)
    return [output]
```
```shell
sudo chown www-data:www-data /var/www/html/wsgitest.py
sudo chmod 775 /var/www/html/wsgitest.py
```
```shell
sudo nano /etc/apache2/sites-enabled/000-default.conf
```

Before `</VirtualHost>`
```text
WSGIScriptAlias /wsgi /var/www/html/wsgitest.py
```

```shell
sudo systemctl restart apache2
```

```text
http://your-server-ip/wsgi
```
