import React, {useState} from "react";

export default function Calc() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    let relUrl;
    if (window.location.host === 'localhost:5173')
        // Handle vite dev mode.
        relUrl = "localhost:8181";
    else if (window.location.port !== 80)
        // Handle docker mode with apach2 ProxyPass setup.
    {
        console.log(`Is !== 80: ${window.location}`);
        relUrl = `${window.location.hostname}:${window.location.port}/api/demo_cpp`;
    } else {
        console.log(`Is === 80: ${window.location}`);
        relUrl = `${window.location.hostname}/api/demo_cpp`;
    }
    console.log(`relUrl2=${relUrl}`);


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
            console.log(`relUrl3=${relUrl}`);
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
                <b>Enter: </b>
                <label>
                    Operand 1: <input name="a" defaultValue="12"/>
                </label>
                <label>
                    Operand 2: <input name="b" defaultValue="10"/>
                </label>
                <hr/>
                <button type="reset">Reset form</button>
                <button type="submit">Perform +, -, *, / calculations</button>
            </form>
            <h2>Data Flow:</h2>
            <ul>
                <li><b>UI (demo_ui container):</b> Posts form data as JSON to URL "/api/demo_cpp/api/math/ops_a_b" to
                    ...
                </li>
                <li><b>Apache Web Host (demo_ui container)</b>: Uses &lt;ProxyPass&gt; to redirect to..</li>
                <li><b>C++ Microservices (demo_cpp container)</b>: Processes request and returns JSON response</li>
                <li><b>UI (demo_ui container):</b> 'React UI' redisplays with state changes.</li>
            </ul>
        </div>
    );
}
