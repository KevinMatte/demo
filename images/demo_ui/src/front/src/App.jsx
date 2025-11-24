import React, {useState} from 'react';
import "./css/App.css";
import appCSS from "./css/App.module.css";
import Menu from './parts/Menu.jsx';
import Overview, {toolDefn as overviewToolDefn} from './pages/docs/Overview.jsx';
import CPP, {toolDefn as cppToolDefn} from './pages/simple_demos/CPP.jsx';
import Python, {toolDefn as pythonToolDefn} from './pages/simple_demos/Python.jsx';
import PHP, {toolDefn as phpToolDefn} from './pages/simple_demos/PHP.jsx';
import Java, {toolDefn as javaToolDefn} from './pages/simple_demos/Java.jsx';
import DemoAnchor from "./parts/Anchors.jsx";
import Notes, {toolDefn as notesToolDefn} from './pages/docs/Notes.jsx';

function App() {
    const [pageName, setPageName] = useState('overview');

    const menuHandler = (item) => {
        setPageName(item);
    }

    const menu = {
        "overview": {"label": "Overview", 'toolDefn': overviewToolDefn, 'page': null },
        "notes": {"label": "Notes", 'toolDefn': notesToolDefn, 'page': (<Notes/>)},
        "cpp_hello": {"label": "C++", 'toolDefn': cppToolDefn, 'page': (<CPP/>)},
        "python_hello": {"label": "Python", 'toolDefn': pythonToolDefn, 'page': (<Python/>)},
        "php_hello": {"label": "PHP", 'toolDefn': phpToolDefn, 'page': (<PHP/>)},
        "java_hello": {"label": "Java", 'toolDefn': javaToolDefn, 'page': (<Java/>)},
    };
    menu.overview.page = (<Overview menu={menu} handleClick={menuHandler}/>);

    let pageDefn = menu[pageName];
    let pageTitle = (<h2>{pageDefn.toolDefn.title}</h2>);
    let appPage = pageDefn.toolDefn.className || appCSS.appPage;
    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu} selectedMenuName={pageName}/>
            <DemoAnchor path="" label="GitHub Source KevinMatte / demo"/><br/>
            <div className={appCSS.appBody}>
                <hr/>
                <div className={appPage}>
                    {pageDefn.toolDefn.title && pageTitle}
                    {pageDefn.page}
                </div>
            </div>
            {pageDefn.toolDefn.toolDocs}
        </div>
    )
}

export default App
