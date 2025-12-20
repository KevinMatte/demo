import React from "react";
import IFrameTool from "@/parts/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "@/parts/Anchors.jsx";

export const toolDocs = (
    <ul>
        <li><b>Main Code</b>:</li>
        <ul>
            <li><DemoAnchor title="Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/Python.jsx"/>
            </li>
            <li><DemoAnchor title="Server"
                            path="images/demo_ui/apps/playground/static/var/www/html/py_app/hello_world.py"/>
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
                            path="images/demo_ui/static/etc/apache2/sites-available/000-default.conf">
                </DemoAnchor>
                : See &lt;Diretory "/var/www/html/py_app"&gt;
            </li>
        </ul>
    </ul>
);
export const toolDefn = {
    "title": "Demo: WSGI Python Example",
    "description": <b><u>WSGI Python Example</u></b>,
    "summary": <>JSX -&gt; Apache -&gt; Apache MOD_WSGI -&gt; Python Script</>,
};

export default function Python() {
    return (
        <>
            <h2>Python Wiring/Framework</h2>
            <hr/>
            <IFrameTool url="/py_app/hello_world.py"/>
            <hr/>
            <h2>Tech Stack:</h2>
            {toolDocs}
        </>
    );
}
