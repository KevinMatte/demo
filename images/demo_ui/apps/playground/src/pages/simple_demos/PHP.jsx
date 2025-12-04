import React from "react";
import IFrameTool from "@/parts/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "@/parts/Anchors.jsx";

export const toolDocs = (
    <div>
        <h2>Tech Stack:</h2>
        <ul>
            <li><b>Main Code</b>:</li>
            <ul>
                <li><DemoAnchor title="Client" path="images/demo_ui/apps/playground/src/pages/simple_demos/PHP.jsx"/></li>
                <li><DemoAnchor title="Server" path="images/demo_ui/apps/playground/src/static/var/www/html/hello_world.php"/></li>
            </ul>
            <li><b>Configuration</b></li>
            <ul>
                <li>
                    <Anchor title="PHP WSGI"
                            path="https://packages.debian.org/sid/httpd/libapache2-mod-php">libapache2-mod-php</Anchor>
                    : Debian Apache2 Docs
                </li>
            </ul>
        </ul>
    </div>
);
export const toolDefn = {
    "title": "Demo: Apache PHP Example",
    "description": <span><b>Demo</b>: Apache PHP Example</span>,
    "toolDocs": toolDocs,
};

export default function PHP() {
    return (<IFrameTool url="/hello_world.php"/>);
}
