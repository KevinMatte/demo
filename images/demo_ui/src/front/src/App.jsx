import React, { useState } from 'react';
import './css/App.css'
import './css/styles.css'
import Purpose from './Purpose.jsx';
import Menu from './Menu.jsx';

function App() {
    const [page, setPage] = useState('purpose');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch('http://127.0.0.1:28080/api/math/ops_a_b/5/20'); // Replace with your API endpoint
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
    const menuHandler = (item) => {
        setPage(item);
    }

    let results = '';
    if (error)
        results = error;
    else if (data)
        results = (<pre>{JSON.stringify(data, null, 2)}</pre>);

    return (
    <div>
        <h1>Playground/Demo Project</h1>

        <p><b>Project Location</b>: <a target="km_github" href="https://github.com/KevinMatte/demo">https://github.com/KevinMatte/demo</a></p>

        <Menu handler={menuHandler}/>
        {page === 'purpose' && <Purpose/>}

        <div>
            <button onClick={handleClick}>
                Click Me
            </button>
        </div>
        <div>
            {results}
        </div>
    </div>
  )
}

export default App
