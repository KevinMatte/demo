import React, {useState} from 'react';
import "@/css/App.css";
import appCSS from "@/css/App.module.css";
import Menu from '@/parts/Menu.jsx';
import DemoAnchor from "@/parts/Anchors.jsx";
import TabPages, {toolDefn as notesToolDefn} from '@docs/TabPages.jsx';
import {menus_apps, menus_skeletons} from "@/vars/menus.jsx";
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
            "label": "Notes", 'toolDefn': notesToolDefn,
            'page': <TabPages tabMenu={notesMenu} key="notesMenu"/>
        },
        "skeletons": {
            "label": "Skeletons", 'toolDefn': {
                "title": "Skeletons",
                "description": <span><b>Documentation</b>: App Skeletons/Frameworks/Stacks</span>,
                "toolDocs": null,
            },
            'page': <MenuSummary menu={menus_skeletons} handleClick={menuHandler}/>
        },
        "apps": {
            "label": "Apps", 'toolDefn': {
                "title": "WIP Apps",
                "description": <span><b>Full Page Apps</b>: In various states of WIP. A &lt;Back&gt; button will be on the top.</span>,
                "toolDocs": null,
                "className": "TabPages",
            },
            'page': <MenuSummary menu={menus_apps} handleClick={menuHandler} key="apps"/>
        },
    };

    const [pageName, setPageName] = useState('notes');
    const [menuDefn, setMenuDefn] = useState(menu);

    let pageDefn = menuDefn[pageName];
    let appPage = pageDefn.toolDefn.className || appCSS.appPage;
    return (
        <div className={appCSS.app}>
            <h1>Playground/Demo Project</h1>
            <Menu handler={menuHandler} menu={menu} selectedMenuName={pageName}/>
            <DemoAnchor path="" label="GitHub Source KevinMatte / demo"/><br/>
            <div className={appCSS.appBody}>
                <hr/>
                <div className={appPage}>
                    {pageDefn.page}
                </div>
            </div>
            {pageDefn.toolDefn.toolDocs}
        </div>
    )
}

export default App
