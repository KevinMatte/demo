import React, {useState} from "react";
import DemoAnchor, {Anchor} from "../parts/Anchors.jsx";

const toolDocs =
    (
        <div>
            <h2>Tech Stack:</h2>
            <ul>
                <li>
                    <b>Main Code</b>:
                </li>
                <ul>
                    <li><DemoAnchor title="Client" path="images/demo_ui/src/front/src/pages/CPP.jsx"/></li>
                    <li><DemoAnchor title="Server" path="images/demo_cpp/src/main.cpp"/></li>
                </ul>
                <li><b>Configuration</b></li>
                <ul>
                    <li>
                        <Anchor title="/api/demo_cpp URL Proxy"
                                path="https://httpd.apache.org/docs/current/mod/mod_proxy.html">
                            MOD PROXY
                        </Anchor>
                    </li>
                    <li>
                        <DemoAnchor title="/api/demo_cpp URL Proxy"
                                    path="images/demo_ui/src/static/etc/apache2/sites-available/000-default.conf"
                        />
                        &lt;Location "/api/demo_cpp/"&gt;
                    </li>

                </ul>

            </ul>
        </div>
    )
;
export const toolDefn = {
    "title": "Demo: C++ Microservices Example",
    "toolDocs": toolDocs,
};

export default function CPP() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    let relUrl;
    if (window.location.host === 'localhost:5173')
        // Handle vite dev mode.
        relUrl = "localhost:8181";
    else if (window.location.port !== 80)
        // Handle docker mode with apach2 ProxyPass setup.
        relUrl = `${window.location.hostname}:${window.location.port}/api/demo_cpp`;
    else
        relUrl = `${window.location.hostname}/api/demo_cpp`;


    const handleReset = () => {
        setData(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const method = form.method;
        const body = JSON.stringify(Object.fromEntries(formData));
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`http://${relUrl}/api/math/ops_a_b`, {method, body}
            );
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else
                setError(`HTTP error! status: ${response.status}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    let results = '';
    if (error)
        results = error;
    else if (data)
        results = (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>Added:</th>
                        <td>{data.add}</td>
                        <th>Deleted:</th>
                        <td>{data.delete}</td>
                    </tr>
                    <tr>
                        <th>Divided:</th>
                        <td>{data.divide}</td>
                        <th>Multiplied:</th>
                        <td>{data.multiply}</td>
                    </tr>
                    </tbody>
                </table>
                <hr/>
            </div>
        );

    return (
        <div>
            {loading && <p>Loading</p>}
            <div>
                {results}
            </div>

            <form method="post" onSubmit={handleSubmit} onReset={handleReset}>
                <b>Enter:</b>
                <br/>
                <label>
                    Operand 1: <input name="op1" defaultValue="12"/>
                </label>
                <br/>
                <label>
                    Operand 2: <input name="op2" defaultValue="10"/>
                </label>
                <hr/>
                <button type="submit">Perform +, -, *, / calculations</button>
                {data && <button type="reset">Reset form</button>}
            </form>
        </div>
    );
}

