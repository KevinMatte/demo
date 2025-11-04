import React from "react";
import IFrameTool from "./IFrameTool.jsx";
import DemoAnchor, {Anchor, WebServerLI} from "./DemoAnchor.jsx";

export const toolDocs = (
    <div>
        <h2>Tech Stack:</h2>
        <ul>
            <li>Docker Compose</li>
            <ul>
                <li><DemoAnchor path="images/demo_ui/Dockerfile"/></li>
                <ul>
                    <li><DemoAnchor title="React Component" path="images/demo_ui/src/front/src/Python.jsx"/></li>
                    {WebServerLI}
                    <li><Anchor title="Apache" path="https://packages.debian.org/sid/httpd/libapache2-mod-wsgi-py3">MOD WSGI</Anchor></li>
                    <ul>
                        <li><DemoAnchor title="Image Setup" path="images/demo_ui/Dockerfile"/></li>
                        <DemoAnchor title="URL Proxy for /py_app"
                                    path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf"
                                    label="apache site: 000-default.conf"
                        />
                    </ul>

                    <li>Python: <DemoAnchor path="images/demo_ui/src/static/var/www/html/py_app/hello_world.py"/></li>
                </ul>
            </ul>
        </ul>
    </div>
);
export const toolDefn = {
    "title": "WSGI Python example.",
    "toolDocs": toolDocs,
};

export default function Python() {
    return (<IFrameTool url="/py_app/hello_world.py"/>);
}
