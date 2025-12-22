import os
import re, json

def application(environ, start_response):
    """Just handling a simple response for now.
    """
    status = '200 OK'

    values = {}
    path = environ['load_from'] if 'load_from' in environ else '/var/www/html/public/image_versions.ish'
    try:
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
        values["success"] = True
    except:
        values={
            "success": False,
            "error": f"Failed to oopen {path}"
        }

    output = json.dumps(values)

    # TODO: Should declare this as a constant in a Python module
    response_headers = [
        ('Content-type', 'application/json'),
        ('Content-Length', str(len(output))),
        ('Cache-Control', "no-cache, no-store, must-revalidate"),
        ('Pragma', "no-cache"),
        ('Expires', "0"),
    ]
    no_cors = os.environ['NO_CORS'] if 'NO_CORS' in os.environ else False
    if no_cors:
        response_headers.append(('Access-Control-Allow-Origin', "*"))
    start_response(status, response_headers)

    return [output.encode('utf-8')]

def test():
    def start_response(status, headers):
        pass


    environ = {"load_from": "src/docker/image_versions.ish"}
    res = application(environ, start_response)
    print(res)

if __name__ == "__main__":
    test()
