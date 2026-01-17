import React from "react";
import IFrameTool from "@/parts/IFrameTool.jsx";
import DemoAnchor, {Anchor} from "@/parts/Anchors.jsx";

const toolDocs =
    (
        <ul>
            <li><b>Main Code</b></li>
            <ul>
                <li><DemoAnchor title="Client"
                                path="images/demo_ui/apps/playground/src/pages/simple_demos/NodeJS.jsx"/></li>
                <li><DemoAnchor title="Server" path="images/demo_nodejs/src/server.ts"/></li>
            </ul>
            <li><b>Configuration</b></li>
            <ul>
                <li>
                    <DemoAnchor title="update_build.sh" path="images/demo_ui/apps/playground/bin/update_build.sh"
                    />
                    : See line with &lt;Location "/api/demo_nodejs/"&gt;
                </li>
                <li>
                    <Anchor title="/api/demo_nodejs/ URL Proxy"
                            path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">MOD PROXY</Anchor>
                    : httpd.apache.org/docs
                </li>

                <li>
                    <DemoAnchor title="/api/demo_nodejs/ URL Proxy"
                                path="images/demo_ui/static/etc/apache2/sites-available/000-default.conf"
                    />
                    : See &lt;Location "/api/demo_nodejs/"&gt;
                </li>
            </ul>
        </ul>
    );


export default function Nodejs() {
    return (
        <>
            <h2>Python Wiring/Framework</h2>
            <hr/>
            <IFrameTool url="/api/demo_nodejs/"/>
            <hr/>
            <h2>Tech Stack:</h2>
            {toolDocs}
        </>
    );
}

export const toolDefn = {
    "title": "Demo: Nodejs Servlet Example",
    "description": <b>Nodejs Servlet Example</b>,
    "summary": <>JSX -&gt; Apache -&gt; MOD_PROXY -&gt; Docker Container -&gt; NodeJS  -&gt; server.ts</>,
};

