import os

def application(environ, start_response):
    """Just handling a simple response for now.

    TODO: If I do more, I'll use one of the templating languages like moustache.
    """
    status = '200 OK'

    # Get 'head_content.txt' which contains a standard content for the demo's HTML <head>.
    template_dir = os.path.join(environ['DOCUMENT_ROOT'], 'public', 'templates')
    try:
        head_content_path = os.path.join(template_dir, 'head_content.txt')
        with open(head_content_path, 'r') as file:
            lines = file.readlines()
            head_content = ''.join(lines)
    except (FileNotFoundError, IOError):
        head_content = ''

    output = f"""
<!DOCTYPE html>
<html lang="en">
<head>{head_content}</head>

<body>
<div style="padding: 25px">
    Hello World: Python WSGI Script
</div>
</body>

</html>
    """

    # TODO: Should declare this as a constant in a Python module
    response_headers = [
        ('Content-type', 'text/html'),
        ('Content-Length', str(len(output))),

        # The following should be picked up with head_content.txt.
        # I wanted to combine the two methods of setting headers.
        # ("Cache-Control", "no-cache, no-store, must-revalidate"),
        # ("Pragma", "no-cache"),
        # ("Expires", "0"),
    ]
    start_response(status, response_headers)

    return [output.encode('utf-8')]
