import React from "react";
import IFrameTool from "./IFrameTool.jsx";

export const toolDocs = (
    <div>
        <h2>Tech Stack:</h2>
        <ul>
            <li>Docker Compose</li>
            <ul>
                <li>demo_ui: docker container</li>
                <ul>
                    <li>React UI</li>
                    <li>Javascript Fetch</li>
                    <li>Apache</li>
                    <li>Apache: libapache2-mod-wsgi-py3</li>
                    <li>Python3: hello_world.py</li>
                </ul>
            </ul>
        </ul>
    </div>
);

export default function Python() {
    return (<IFrameTool url="/py_app/hello_world.py"/>);
}
