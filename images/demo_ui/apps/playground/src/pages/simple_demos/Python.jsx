import React from "react";
import IFrameTool from "../lib/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "../../parts/Anchors.jsx";

export const toolDocs = (
    <div>
        <h2>Tech Stack:</h2>
        <ul>
            <li><b>Main Code</b>:</li>
            <ul>
                <li><DemoAnchor title="Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/Python.jsx"/></li>
                <li><DemoAnchor title="Server" path="images/demo_ui/apps/playground/src/static/var/www/html/py_app/hello_world.py"/>
                </li>
            </ul>
            <li><b>Configuration</b></li>
            <ul>
                <li>
                    <Anchor title="/py_app URL Proxy"
                            path="https://packages.debian.org/sid/httpd/libapache2-mod-wsgi-py3">
                        MOD WSGI
                    </Anchor>
                    : Debian Apache2 Docs
                </li>
                <li>
                    <DemoAnchor title="/py_app URL Proxy"
                                path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf">
                    </DemoAnchor>
                    : See &lt;Diretory "/var/www/html/py_app"&gt;
                </li>
            </ul>
        </ul>
    </div>
);
export const toolDefn = {
    "title": "Demo: WSGI Python Example",
    "description": <span><b>Demo</b>: WSGI Python Example</span>,
    "toolDocs": toolDocs,
};

export default function Python() {
    return (<IFrameTool url="/py_app/hello_world.py"/>);
}
