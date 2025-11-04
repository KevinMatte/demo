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
                    <li>Apache Proxy</li>
                </ul>
                <li>demo_java: docker container</li>
                <ul>
                    <li>Tomcat: tomcat:jre25-temurin-noble</li>
                    <li>Java Servlet: Hello World copied sample</li>
                </ul>
            </ul>
        </ul>
    </div>
);

export default function Java() {
    return (<IFrameTool url="/api/demo_java/MyApp/HelloWorld"/>);
}
