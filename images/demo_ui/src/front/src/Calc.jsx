import React, {useState} from "react";

export default function Calc() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    let relUrl;
    if (window.location.host === 'localhost:5173')
        // Handle vite dev mode.
        relUrl = "localhost:8080";
    else if (window.location.port !== 80)
        // Handle docker mode with apach2 ProxyPass setup.
    {
        console.log(`Is !== 80: ${window.location}`);
        relUrl = `${window.location.hostname}:${window.location.port}`;
    }
    else {
        console.log(`Is === 80: ${window.location}`);
        relUrl = `${window.location.hostname}`;
    }
    console.log(`relUrl2=${relUrl}`);


    const handleMathRequest = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`http://${relUrl}/api/demo_cpp/api/math/ops_a_b/5/20`);
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
        results = (<pre>{JSON.stringify(data, null, 2)}</pre>);

    return (
      <div>
          <h2>Calc Stub</h2>
          <p><b>WIP: Testing demo_ui using demo_cpp microservices.</b></p>
          {loading && <p>Loading</p>}
          <button onClick={() => handleMathRequest()}>
              Perform +, -, *, / calculations
          </button>
          <div>
              {results}
          </div>
      </div>
    );
}
