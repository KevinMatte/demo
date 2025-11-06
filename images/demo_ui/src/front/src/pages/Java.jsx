import React from "react";
import IFrameTool from "./lib/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "../lib/Anchors.jsx";

const toolDocs =
    (
        <div>
            <h2>Tech Stack:</h2>
            <ul>
                <li><b>Main Code</b></li>
                <ul>
                    <li><DemoAnchor title="Client" path="images/demo_ui/src/front/src/Java.jsx"/></li>
                    <li><DemoAnchor title="Server" path="images/demo_java/src/HelloWorld.java"/></li>
                </ul>
                <li><b>Configuration</b></li>
                <ul>
                    <li><Anchor title="/api/demo_java/ URL Proxy"
                                path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">MOD
                        PROXY</Anchor></li>
                    <DemoAnchor title="/api/demo_java/ URL Proxy"
                                path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf"
                                label='&lt;Location "/api/demo_java/>"&gt;'
                    />
                    <li><DemoAnchor title="Tomcat Servlet Config" label="webapps/MyApp"
                                    path="images/demo_java/mount/usr/local/tomcat/webapps/MyApp"/></li>
                </ul>

            </ul>
        </div>
    );


export default function Java() {
    return (<IFrameTool url="/api/demo_java/MyApp/HelloWorld"/>);
}

export const toolDefn = {
    "title": "Demo: Java Servlet example.",
    "toolDocs": toolDocs,
};

