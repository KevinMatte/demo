import React, {useState} from 'react';
import "@/css/App.css";
import appCSS from "@/css/App.module.css";
import Menu from '@/parts/Menu.jsx';
import DemoAnchor from "@/parts/Anchors.jsx";
import TabPages, {toolDefn as notesToolDefn} from '@docs/TabPages.jsx';
import {menus_apps, menus_wirings} from "@/vars/menus.jsx";
import MenuSummary from '@docs/MenuSummary.jsx';
import Build, {toolDefn as buildToolDefn} from "@/pages/docs/Build.jsx";
import Containers, {toolDefn as dockerComposeToolDefn} from "@/pages/docs/Containers.jsx";

function App() {
    const menuHandler = (menu, itemName) => {
        let item = menu[itemName];
        if (!item.page && item.url) {
            let url = `${item.url}?back=${encodeURIComponent(window.location.href)}`;
            window.location.assign(url);
        } else {
            setMenuDefn(menu);
            setPageName(itemName);
        }
    }

    const notesMenu = {
        "build": {"label": "Build", 'toolDefn': buildToolDefn, 'page': (<Build/>)},
        "containers": {"label": "Docker Containers", 'toolDefn': dockerComposeToolDefn, 'page': (<Containers/>)},
    };

    const menu = {
        "notes": {
            "label": "Docs: Base Build & Stack", 'toolDefn': notesToolDefn,
            'page': <TabPages tabMenu={notesMenu} key="notesMenu"/>
        },
        "wirings": {
            "label": "Apps: Dev Stack Wirings", 'toolDefn': {
                "title": "Wirings",
                "description": <span><b>Documentation</b>: App Wirings/Frameworks/Stacks</span>,
            },
            'page': <MenuSummary menu={menus_wirings} handleClick={menuHandler}/>
        },
        "apps": {
            "label": "Apps: Fuller Apps", 'toolDefn': {
                "title": "Apps: Fuller Apps",
                "description": <span><b>Full Page Apps</b>: In various states of WIP. A &lt;Back&gt; button will be on the top.</span>,
                "className": "TabPages",
            },
            'page': <MenuSummary menu={menus_apps} handleClick={menuHandler} key="apps"/>
        },
    };

    const [pageName, setPageName] = useState('notes');
    const [menuDefn, setMenuDefn] = useState(menu);

    let pageDefn = menuDefn[pageName];
    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu} selectedMenuName={pageName}/>
            <DemoAnchor path="" label="GitHub Source KevinMatte / demo"/><br/>
            <hr/>
            <div className={appCSS.appBody}>
                {pageDefn.page}
            </div>
        </div>
    )
}

export default App
