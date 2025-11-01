import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Purpose from './Purpose.jsx';
import AppMenu from './AppMenu.jsx';
import Calc from './Calc.jsx';

function App() {
    const [page, setPage] = useState('purpose');

    const menuHandler = (item) => {
        setPage(item);
    }

    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <AppMenu handler={menuHandler}/>
            <div className={appCSS.appBody}>
                <hr/>
                <br/>
                <div className={appCSS.appPage}>
                    {page === 'purpose' && <Purpose/>}
                    {page === 'cpp_calc' && <Calc/>}
                </div>
            </div>
            <div style={{padding: '0 30px'}}>
                <h2>Notes:</h2>
                <ul>
                    <li>
                        <b>Project Location</b>:
                        <a target="km_github" href="https://github.com/KevinMatte/demo">
                            https://github.com/KevinMatte/demo
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default App
