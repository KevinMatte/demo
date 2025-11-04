import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Overview from './Overview.jsx';
import Menu from './Menu.jsx';
import Calc, {toolDocs as calcToolDocs} from './Calc.jsx';
import Python, {toolDocs as pythonToolDocs} from './Python.jsx';
import PHP, {toolDocs as phpToolDocs} from './PHP.jsx';
import Java, {toolDocs as javaToolDocs} from './Java.jsx';
import DemoAnchor from "./DemoAnchor.jsx";

function App() {
    const [page, setPage] = useState('purpose');

    const menuHandler = (item) => {
        setPage(item);
    }
    const menu = [
        {"label": "Overview", "name": "purpose",
            "title": "Summary of this demo"},
        {"label": "C++", "name": "cpp_calc", calcToolDocs,
            "title": "C++ Program running as Microservices"
        },
        {"label": "Python", "name": "python_hello", pythonToolDocs,
            "title": "WSGI Python example."
        },
        {"label": "PHP", "name": "php_hello",
            "title": "Apache PHP example."
        },
        {"label": "Java", "name": "java_hello",
            "title": "Java Servlet example."
        },
    ];

    let pages = {
        'purpose': {'page': (<Overview menu={menu}/>)},
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
                        <DemoAnchor path="" label="GitHub KevinMatte / demo"/>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default App
