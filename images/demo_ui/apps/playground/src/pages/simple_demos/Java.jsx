import React from "react";
import IFrameTool from "@/parts/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "@/parts/Anchors.jsx";

const toolDocs =
    (
        <ul>
            <li><b>Main Code</b></li>
            <ul>
                <li><DemoAnchor title="Client"
                                path="images/demo_ui/apps/playground/src/pages/simple_demos/Java.jsx"/></li>
                <li><DemoAnchor title="Server" path="images/demo_java/src/MyApp/HelloWorld.java"/></li>
            </ul>
            <li><b>Configuration</b></li>
            <ul>
                <li>
                    <Anchor title="/api/demo_java/ URL Proxy"
                            path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">MOD
                        PROXY</Anchor>
                    : httpd.apache.org/docs
                </li>
                <li>
                    <DemoAnchor title="/api/demo_java/ URL Proxy"
                                path="images/demo_ui/static/etc/apache2/sites-available/000-default.conf"
                    />
                    : See &lt;Location "/api/demo_java/"&gt;
                </li>
                <li>
                    <DemoAnchor title="Tomcat Servlet Config" label="webapps/MyApp"
                                path="images/demo_java/src/MyApp"/>
                </li>
            </ul>

        </ul>
    );


export default function Java() {
    return (
        <>
            <h2>Python Wiring/Framework</h2>
            <hr/>
            <IFrameTool url="/api/demo_java/MyApp/HelloWorld"/>
            <hr/>
            <h2>Tech Stack:</h2>
            {toolDocs}
        </>
    );
}

export const toolDefn = {
    "title": "Demo: Java Servlet Example",
    "description": <b>Java Servlet Example</b>,
    "summary": <>JSX -&gt; Apache -&gt; MOD_PROXY -&gt; Docker Container -&gt; Tomcat  -&gt; Tomcat Servlet</>,
};

