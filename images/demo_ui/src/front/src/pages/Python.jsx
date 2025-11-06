import React from "react";
import IFrameTool from "./lib/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "../lib/Anchors.jsx";

export const toolDocs = (
    <div>
        <h2>Tech Stack:</h2>
        <ul>
            <li><b>Main Code</b>:</li>
            <ul>
                <li><DemoAnchor title="Client" path="images/demo_ui/src/front/src/Python.jsx"/></li>
                <li><DemoAnchor title="Server" path="images/demo_ui/src/static/var/www/html/py_app/hello_world.py"/>
                </li>
            </ul>
            <li><b>Configuration</b></li>
            <ul>
                <li>
                    <Anchor title="/py_app URL Proxy"
                            path="https://packages.debian.org/sid/httpd/libapache2-mod-wsgi-py3">
                        MOD WSGI
                    </Anchor>
                </li>
                <li>
                    <DemoAnchor title="/py_app URL Proxy"
                                path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf">
                        &lt;Diretory "/var/www/html/py_app"&gt;
                    </DemoAnchor>
                </li>
            </ul>
        </ul>
    </div>
);
export const toolDefn = {
    "title": "Demo: WSGI Python example.",
    "toolDocs": toolDocs,
};

export default function Python() {
    return (<IFrameTool url="/py_app/hello_world.py"/>);
}
