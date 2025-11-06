import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Menu from './lib/Menu.jsx';
import Overview, {toolDefn as overviewToolDefn} from './pages/Overview.jsx';
import Calc, {toolDefn as calcToolDefn} from './pages/Calc.jsx';
import Python, {toolDefn as pythonToolDefn} from './pages/Python.jsx';
import PHP, {toolDefn as phpToolDefn} from './pages/PHP.jsx';
import Java, {toolDefn as javaToolDefn} from './pages/Java.jsx';
import DemoAnchor from "./lib/Anchors.jsx";
import DockerCompose, {toolDefn as dockerComposeToolDefn} from './pages/DockerCompose.jsx';

function App() {
    const [pageName, setPageName] = useState('purpose');

    const menuHandler = (item) => {
        setPageName(item);
    }

    const menu = {
        "purpose": {"label": "Overview", 'toolDefn': overviewToolDefn, 'page': null },
        "dockercompose": {"label": "Containers", 'toolDefn': dockerComposeToolDefn, 'page': (<DockerCompose/>)},
        "cpp_calc": {"label": "C++", 'toolDefn': calcToolDefn, 'page': (<Calc/>)},
        "python_hello": {"label": "Python", 'toolDefn': pythonToolDefn, 'page': (<Python/>)},
        "php_hello": {"label": "PHP", 'toolDefn': phpToolDefn, 'page': (<PHP/>)},
        "java_hello": {"label": "Java", 'toolDefn': javaToolDefn, 'page': (<Java/>)},
    };
    menu.purpose.page = (<Overview menu={menu}/>);

    let pageDefn = menu[pageName];
    let pageTitle = (<h2>{pageDefn.toolDefn.title}</h2>);
    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu}/>
            <div className={appCSS.appBody}>
                <hr/>
                <br/>
                <div className={appCSS.appPage}>
                    {pageTitle}
                    {pageDefn.page}
                </div>
            </div>
            {pageDefn.toolDefn.toolDocs}
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
