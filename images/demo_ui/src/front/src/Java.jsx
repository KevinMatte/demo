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
                    <li><DemoAnchor title="React Component" path="images/demo_ui/src/front/src/Java.jsx"/></li>
                    {WebServerLI}
                    <li><Anchor title="Apache" path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">MOD
                        PROXY</Anchor></li>
                    <ul>
                        <li>
                            <DemoAnchor title="ProxyPass Configuration"
                                        path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf"
                                        label="apache site: 000-default.conf"
                            />
                            <br/><code>/api/demo_java/</code> redirected to <code>http://demo_java:8080/</code>
                        </li>
                    </ul>
                </ul>
                <li><DemoAnchor path="images/demo_java/Dockerfile"/></li>
                <ul>
                    <li><Anchor title="Tomcat" label="tomcat:jre25-temurin-noble" path="https://hub.docker.com/_/tomcat/tags?name=jre25-temurin-noble"/> </li>
                    <ul>
                        <li><DemoAnchor title="Java Servlet" path="images/demo_java/src/HelloWorld.java">
                            Hello World copied example from Tomcat
                        </DemoAnchor>
                        </li>
                        <li><DemoAnchor title="Tomcat Servlet Config" label="webapps/MyApp"
                                        path="images/demo_java/mount/usr/local/tomcat/webapps/MyApp"/></li>
                    </ul>
                </ul>
            </ul>
        </ul>
    </div>
);


export default function Java() {
    return (<IFrameTool url="/api/demo_java/MyApp/HelloWorld"/>);
}

export const toolDefn = {
    "title": "Java Servlet example.",
    "toolDocs": toolDocs,
};

