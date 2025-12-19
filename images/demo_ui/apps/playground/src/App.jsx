import React, {useState} from 'react';
import "@/css/App.css";
import appCSS from "@/css/App.module.css";
import Menu from '@/parts/Menu.jsx';
import DemoAnchor from "@/parts/Anchors.jsx";
import TabPages, {toolDefn as notesToolDefn} from '@docs/TabPages.jsx';
import {menus_apps, menus_skeletons} from "@/vars/menus.jsx";
import Overview, {toolDefn as overviewToolDefn} from '@/pages/docs/Overview.jsx';
import Build, {toolDefn as buildToolDefn} from "@/pages/docs/Build.jsx";
import Containers, {toolDefn as dockerComposeToolDefn} from "@/pages/docs/Containers.jsx";

function App() {
    const [pageName, setPageName] = useState('notes');

    const menuHandler = (item) => {
        setPageName(item);
    }

    let topMenu = {...menus_skeletons, ...menus_apps};

    const notesMenu = {
        "overview": {"label": "Overview", 'toolDefn': overviewToolDefn,
            'page': (<Overview menu={topMenu} heading="Overview" handleClick={menuHandler}/>)},
        "build": {"label": "Build", 'toolDefn': buildToolDefn, 'page': (<Build/>)},
        "containers": {"label": "Docker Containers", 'toolDefn': dockerComposeToolDefn, 'page': (<Containers/>)},
    };

    const menu = {
        "notes": {"label": "Notes", 'toolDefn': notesToolDefn,
            'page': <TabPages tabMenu={notesMenu}/>},
        ...topMenu,
    };

    let pageDefn = menu[pageName];
    let pageTitle = "";
    if (!pageDefn.toolDefn.noTitle && pageDefn.toolDefn.title)
        pageTitle = (<h2>{pageDefn.toolDefn.title}</h2>);
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
