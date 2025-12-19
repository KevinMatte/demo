import React, {useState} from 'react';
import "@/css/App.css";
import appCSS from "@/css/App.module.css";
import Menu from '@/parts/Menu.jsx';
import DemoAnchor from "@/parts/Anchors.jsx";
import MenuPage, {toolDefn as notesToolDefn} from '@docs/MenuPage.jsx';
import {menus_apps, menus_skeletons} from "@/vars/menus.jsx";

function App() {
    const [pageName, setPageName] = useState('notes');

    const menuHandler = (item) => {
        setPageName(item);
    }

    const menu = {
        "notes": {"label": "MenuPage", 'toolDefn': notesToolDefn,
            'page': <MenuPage menu={{...menus_skeletons, ...menus_apps}} handleClick={menuHandler}/>},
        ...menus_skeletons,
        ...menus_apps,
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
