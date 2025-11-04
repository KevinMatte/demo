import DemoAnchor, {Anchor, WebServerLI} from "./DemoAnchor.jsx";
import React from "react";
import menuCss from "./css/Menu.module.css";

export const toolDefn = {
    "title": "Summary of this demo",
    "toolDocs": null,
};

function Overview({menu}) {

    const rMenu = Object.keys(menu).map(name => {
            let item = menu[name];
            console.log(name);
            return (
                <li style={{height: "35px"}} key={name}>
                    <span className={menuCss.menuButton}>{item.label}</span>: {item.toolDefn.title}</li>
            );
        }
    );

    return (
        <div>
            <h2>Purpose</h2>
            <ul>
                <li>For myself:</li>
                <ul>
                    <li>Progressively review and exercise a selection of technologies from my resume.</li>
                </ul>
                <li>For others:
                </li>
                <ul>
                    <li>Demonstrate my code and abilities.</li>
                </ul>
                <li>Note: For this study, I'm not using existing frameworks.
                    <ul>
                        <li>A bare-bones React was integrated using bare npx vite commands</li>
                        <li>I wrote my own file monitor to redo builds in a development environment.</li>
                    </ul>

                </li>
            </ul>

            <h2>Menu</h2>
            <ul>
                {rMenu}
            </ul>

            <h2>Architecture Overview</h2>

            <h3>Project Build</h3>
            <ul>
                <li>Docker Compose: Generate Build Files</li>
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
            </ul>

            <h3>Docker Compose images</h3>
            <ul>
                <li><DemoAnchor title="demo_ui" path="images/demo_ui/Dockerfile"></DemoAnchor></li>
                <ul>
                    {WebServerLI}
                    <li><Anchor title="Apache" path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">MOD
                        PROXY</Anchor></li>
                    <li><Anchor title="Apache" path="https://packages.debian.org/sid/httpd/libapache2-mod-wsgi-py3">MOD
                        WSGI</Anchor></li>
                    <li><Anchor title="Apache"
                                path="https://packages.debian.org/sid/httpd/libapache2-mod-php">libapache2-mod-php</Anchor>
                    </li>
                </ul>
                <li><DemoAnchor title="demo_java" path="images/demo_java/Dockerfile"></DemoAnchor></li>
                <ul>
                    <li><Anchor title="Tomcat" label="tomcat:jre25-temurin-noble"
                                path="https://hub.docker.com/_/tomcat/tags?name=jre25-temurin-noble"/></li>
                </ul>
                <li><DemoAnchor title="demo_mariadb" path="images/demo_mariadb/Dockerfile"></DemoAnchor></li>
                <ul>
                    <li><Anchor title="MariaDB MySQL Server" label="mariadb:11.8"
                                path="https://hub.docker.com/_/mariadb/tags?name=11.8-noble"/></li>
                </ul>
                <li><DemoAnchor title="demo_cpp" path="images/demo_cpp/Dockerfile"></DemoAnchor></li>
                <ul>
                    <li><Anchor title="ubuntu:24.04" path="https://hub.docker.com/_/ubuntu/tags?name=24.04"/></li>
                </ul>

            </ul>
        </div>
    )
}

export default Overview;
