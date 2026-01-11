import DemoAnchor, {Anchor, GitHubAnchor} from "@/parts/Anchors.jsx";
import React, {useEffect, useState} from "react";

export const toolDefn = {
    "title": "Documentation: Docker Compose Usage",
    "description": <span><b>Documentation</b>: Docker Compose Usage</span>,
};

function Containers() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    let isDevVite = window.location.host === 'localhost:5173';
    const handleSubmit = async () => {
        // Read the form data
        try {
            const response = await fetch(`${isDevVite ? 'http://localhost:8080' : ''}/py_app/get_versions.py`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                setError(`HTTP error! status: ${response.status}</br>`);
            }
        } catch (err) {
            if (window.location.host !== 'localhost:5173')
                setError(`HTTP error! status: ${err}</br>`);
        }
    }
    useEffect(() => {
        handleSubmit()
    }, []);

    return (
        <div>
            YouTube:
            {error}
            <Anchor path="https://youtu.be/fLLyFpopUcY">Playground Quick Tour</Anchor>
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
                <li><DemoAnchor path="bin/preprocessDockerCompose.py"/>: <br/>
                    Generates target based <code>docker-compose.yaml</code> files by pre-processing:<br/>
                    <DemoAnchor path="src/docker-compose.yaml"/>
                </li>
            </ul>

            <h3>Docker UI Container</h3>
            <div>
                <p>Version: {data && data['DEMO_UI_VERSION']} Built: {data && data['DEMO_UI_DATE']}</p>
                <ul>
                    <li><DemoAnchor title="Build" path="images/demo_ui/Dockerfile"/></li>
                    <li><Anchor title="Apache" path="https://httpd.apache.org/">Apache: HTTP Server Project</Anchor></li>
                    <li><DemoAnchor title="PHP Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/PHP.jsx"/></li>
                    <li><DemoAnchor title="PHP Server" path="images/demo_ui/apps/playground/static/var/www/html/hello_world.php"/></li>
                    <li><DemoAnchor title="Python Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/Python.jsx"/></li>
                    <li><DemoAnchor title="Python Server"
                                    path="images/demo_ui/apps/playground/static/var/www/html/py_app/hello_world.py"/>
                    </li>
                    <li><b>Source Code</b></li>
                    <ul>
                        <li><DemoAnchor title="Java Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/Java.jsx"/></li>
                        <li><DemoAnchor title="Java Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/NodeJS.jsx"/></li>
                        <li><DemoAnchor title="CPP Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/CPP.jsx"/></li>
                    </ul>
                </ul>
            </div>


            <h3>Docker Java Container</h3>
            <div>
                <p>Version: {data && data['DEMO_JAVA_VERSION']} Built: {data && data['DEMO_JAVA_DATE']}</p>
                <ul>
                    <li><DemoAnchor title="Build" path="images/demo_java/Dockerfile"/></li>
                    <li><Anchor title="Tomcat" label="tomcat:jre25-temurin-noble"
                                path="https://hub.docker.com/_/tomcat/tags?name=jre25-temurin-noble"/></li>
                    <li><b>Source Code</b></li>
                    <ul>
                        <li><DemoAnchor title="Server" path="images/demo_java/src/MyApp/HelloWorld.java">
                            Hello World copied example from Tomcat
                        </DemoAnchor>
                        </li>
                    </ul>
                </ul>
            </div>


            <h3>Docker NodeJS Container</h3>
            <div>
                <p>Version: {data && data['DEMO_NODEJS_VERSION']} Built: {data && data['DEMO_NODEJS_DATE']}</p>
                <ul>
                    <li><DemoAnchor title="Build" path="images/demo_nodejs/Dockerfile"/></li>
                    <li><b>Source Code</b></li>
                    <ul>
                        <li>
                            None.
                        </li>
                    </ul>
                </ul>
            </div>


            <h3>Docker CPP Container</h3>
            <div>
                <p>Version: {data && data['DEMO_CPP_VERSION']} Built: {data && data['DEMO_CPP_DATE']}</p>
                <ul>
                    <li><DemoAnchor title="Build" path="images/demo_cpp/Dockerfile"/></li>
                    <li><GitHubAnchor title="Library: C++ Microservices" path="CrowCpp/Crow"/></li>
                    <li><GitHubAnchor title="Library" path="/nlohmann/json"/></li>
                    <li><b>Source Code</b></li>
                    <ul>
                        <li><DemoAnchor title="Server" path="images/demo_cpp/src/main.cpp"/></li>
                    </ul>
                </ul>
            </div>


            <h3>Docker MariaDB Container</h3>
            <div>
                <p>Version: {data && data['DEMO_MARIADB_VERSION']} Built: {data && data['DEMO_MARIADB_DATE']}</p>
                <ul>
                    <li><DemoAnchor title="demo_mariadb" path="images/demo_mariadb/Dockerfile"></DemoAnchor></li>
                    <li><Anchor title="MariaDB MySQL Server" label="mariadb:11.8"
                                path="https://hub.docker.com/_/mariadb/tags?name=11.8-noble"/></li>
                    <li><b>Source Code</b>: None needed, so far.</li>
                </ul>
            </div>

        </div>
    )
}

export default Containers;
