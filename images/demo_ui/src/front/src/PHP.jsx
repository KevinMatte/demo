import React from "react";
import IFrameTool from "./IFrameTool.jsx";
import DemoAnchor, {WebServerLI, Anchor} from "./DemoAnchor.jsx";

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
                    <li><Anchor title="Apache" path="https://packages.debian.org/sid/httpd/libapache2-mod-php">libapache2-mod-php</Anchor></li>
                    <li><DemoAnchor title="JSX" path="images/demo_ui/src/static/var/www/html/hello_world.php"/></li>
                </ul>
            </ul>
        </ul>
    </div>
);
export const toolDefn = {
    "title": "Apache PHP example.",
    "toolDocs": toolDocs,
};

export default function PHP() {
    return (<IFrameTool url="/hello_world.php"/>);
}
