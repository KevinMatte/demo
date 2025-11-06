import DemoAnchor, {Anchor, GitHubAnchor} from "../parts/Anchors.jsx";
import React from "react";

export const toolDefn = {
    "title": "Documentation: Docker Compose Usage",
    "toolDocs": null,
};

function Containers() {

    return (
        <div>
            <h3>Generation of: docker-compose.yaml</h3>
            <ul>
                <li><DemoAnchor path="Makefile"/>: Top Level GNU Makefile with targets like:</li>
                <ul>
                    <li><code>build</code>: One target to build them all</li>
                    <li><code>local</code>: To run containers in local development machine.</li>
                    <li><code>publish</code>: To send versioned images to the 24/7 public host web server.</li>
                </ul>
                <li><DemoAnchor path="bin/generateDotEnv.sh"/>: <br/>
                    Creates <code>.env</code> for Dockerfiles and GNU Makefiles
                </li>
                <li><DemoAnchor path="preprocessDockerCompose.py"/>: <br/>
                    Generates target based <code>docker-compose.yaml</code> files by pre-processing:<br/>
                    <DemoAnchor path="src/docker-compose.yaml"/>
                </li>
            </ul>

            <h3>Docker UI Container</h3>
            <ul>
                <li><DemoAnchor title="Build" path="images/demo_ui/Dockerfile"/></li>
                <li><Anchor title="Apache" path="https://httpd.apache.org/">Apache: HTTP Server Project</Anchor></li>
                <li><DemoAnchor title="PHP Client" path="images/demo_ui/src/front/src/pages/PHP.jsx"/></li>
                <li><DemoAnchor title="PHP Server" path="images/demo_ui/src/static/var/www/html/hello_world.php"/></li>
                <li><DemoAnchor title="Python Client" path="images/demo_ui/src/front/src/pages/Python.jsx"/></li>
                <li><DemoAnchor title="Python Server"
                                path="images/demo_ui/src/static/var/www/html/py_app/hello_world.py"/>
                </li>
                <li><b>Source Code</b></li>
                <ul>
                    <li><DemoAnchor title="Java Client" path="images/demo_ui/src/front/src/pages/Java.jsx"/></li>
                    <li><DemoAnchor title="CPP Client" path="images/demo_ui/src/front/src/pages/CPP.jsx"/></li>
                </ul>
            </ul>

            <h3>Docker Java Container</h3>
            <ul>
                <li><DemoAnchor title="Build" path="images/demo_java/Dockerfile"/></li>
                <li><Anchor title="Tomcat" label="tomcat:jre25-temurin-noble"
                            path="https://hub.docker.com/_/tomcat/tags?name=jre25-temurin-noble"/></li>
                <li><b>Source Code</b></li>
                <ul>
                    <li><DemoAnchor title="Server" path="images/demo_java/src/HelloWorld.java">
                        Hello World copied example from Tomcat
                    </DemoAnchor>
                    </li>
                </ul>
            </ul>

            <h3>Docker CPP Container</h3>
            <ul>
                <li><DemoAnchor title="Build" path="images/demo_cpp/Dockerfile"/></li>
                <li><GitHubAnchor title="Library: C++ Microservices" path="CrowCpp/Crow"/></li>
                <li><GitHubAnchor title="Library" path="/nlohmann/json"/></li>
                <li><b>Source Code</b></li>
                <ul>
                    <li><DemoAnchor title="Server" path="images/demo_cpp/src/main.cpp"/></li>
                </ul>
            </ul>

            <h3>Docker MariaDB Container</h3>
            <ul>
                <li><DemoAnchor title="demo_mariadb" path="images/demo_mariadb/Dockerfile"></DemoAnchor></li>
                <li><Anchor title="MariaDB MySQL Server" label="mariadb:11.8"
                            path="https://hub.docker.com/_/mariadb/tags?name=11.8-noble"/></li>
                <li><b>Source Code</b>: None needed, so far.</li>
            </ul>
        </div>
    )
}

export default Containers;
