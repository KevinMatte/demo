import os
import re, json

def application(environ, start_response):
    """Just handling a simple response for now.
    """
    status = '200 OK'

    pwd=os.getcwd()
    values = {}
    path = environ['load_from'] if 'load_from' in environ else '/mnt/version_data/image_versions.ish'
    with open(path, 'r') as f:
        line = f.readline()
        while line:

            m = re.match('(?P<name>DEMO_[A-Z_]+)=(?P<value>.*)', line)
            if m:
                value = m['value'].strip('"\'')
                if ' #' in value:
                    value = value[:value.index(' #')]
                values[m['name']] = value

            line = f.readline()

    output = json.dumps(values)

    # TODO: Should declare this as a constant in a Python module
    response_headers = [
        ('Content-type', 'application/json'),
        ('Content-Length', str(len(output))),
        ('Cache-Control', "no-cache, no-store, must-revalidate"),
        ('Pragma', "no-cache"),
        ('Access-Control-Allow-Origin', "http://localhost:5173"),
        ('Expires', "0"),
    ]
    start_response(status, response_headers)

    return [output.encode('utf-8')]

def test():
    def start_response(status, headers):
        pass

    environ = {"load_from": "images/demo_ui/build/var/www/html/static/versions.txt"}
    res = application(environ, start_response)
    print(res)

if __name__ == "__main__":
    test()
