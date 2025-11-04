import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Purpose from './Purpose.jsx';
import Menu from './Menu.jsx';
import Calc, {toolDocs as calcToolDocs} from './Calc.jsx';
import Python, {toolDocs as pythonToolDocs} from './Python.jsx';
import PHP, {toolDocs as phpToolDocs} from './PHP.jsx';
import Java, {toolDocs as javaToolDocs} from './Java.jsx';

function App() {
    const [page, setPage] = useState('purpose');

    const menuHandler = (item) => {
        setPage(item);
    }
    const menu = [
        {"label": "Purpose", "name": "purpose"},
        {"label": "C++", "name": "cpp_calc", calcToolDocs},
        {"label": "Python", "name": "python_hello", pythonToolDocs},
        {"label": "PHP", "name": "php_hello"},
        {"label": "Java", "name": "java_hello"},
    ];

    let pages = {
        'purpose': {'page': (<Purpose/>)},
        'cpp_calc': {'page': (<Calc/>), 'toolDocs': calcToolDocs},
        'python_hello': {'page': (<Python/>), 'toolDocs': pythonToolDocs},
        'php_hello': {'page': (<PHP/>), 'toolDocs': phpToolDocs},
        'java_hello': {'page': (<Java/>), 'toolDocs': javaToolDocs},
    };

    let pageDefn = pages[page];
    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu}/>
            <div className={appCSS.appBody}>
                <hr/>
                <br/>
                <div className={appCSS.appPage}>
                    {pageDefn.page}
                </div>
            </div>
            {pages[page].toolDocs}
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
