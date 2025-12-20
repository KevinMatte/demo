import React from "react";

export default function IFrameTool({url}) {

    let relUrl;
    if (window.location.host === 'localhost:5173')
        // Handle vite dev mode.
        relUrl = "http://localhost:8080";
    else if (window.location.port !== "80")
        // Handle docker mode with apach2 ProxyPass setup.
        relUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    else
        relUrl = `${window.location.protocol}//${window.location.hostname}`;
    let fullUrl = relUrl + url;

    return (
        <div>
            <iframe src={fullUrl} width={300} height={100} style={{background: "white", resize: "both"}}>
            </iframe>
        </div>
    );
}
