import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Purpose from './Purpose.jsx';
import Menu from './Menu.jsx';
import Calc from './Calc.jsx';

function App() {
    const [page, setPage] = useState('purpose');

    const menuHandler = (item) => {
        setPage(item);
    }

    return (
        <div className={appCSS.app}>
            <Menu handler={menuHandler}/>
            <h1>Playground/Demo Project</h1>

            <div style={{padding: '30px'}}>
                <h2>Note: Do a hard reset to get latest UI version.</h2>
                <ul>
                    <li>Chrome: Shift-Ctrl-R</li>
                </ul>
            </div>

            <p><b>Project Location</b>: <a target="km_github"
                                           href="https://github.com/KevinMatte/demo">https://github.com/KevinMatte/demo</a>
            </p>

            {page === 'purpose' && <Purpose/>}
            {page === 'cpp_calc' && <Calc/>}
        </div>
    )
}

export default App
