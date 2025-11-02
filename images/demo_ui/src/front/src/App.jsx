import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Purpose from './Purpose.jsx';
import Menu from './Menu.jsx';
import Calc from './Calc.jsx';
import IFrameTool from './IFrameTool.jsx';

function App() {
    const [page, setPage] = useState('purpose');

    const menuHandler = (item) => {
        setPage(item);
    }
    const menu = [
        {"label": "Purpose", "name": "purpose"},
        {"label": "C++ Calc", "name": "cpp_calc"},
        {"label": "Python Hello", "name": "python_hello"},
        {"label": "PHP Hello", "name": "php_hello"},
    ];


    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu}/>
            <div className={appCSS.appBody}>
                <hr/>
                <br/>
                <div className={appCSS.appPage}>
                    {page === 'purpose' && <Purpose/>}
                    {page === 'cpp_calc' && <Calc/>}
                    {page === 'python_hello' && <IFrameTool  url="/py_app/hello_world.py"/>}
                    {page === 'php_hello' && <IFrameTool  url="/hello_world.php"/>}
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
