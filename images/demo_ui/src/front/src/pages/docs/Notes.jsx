import React, {useState} from 'react';
import appCSS from "../../css/App.module.css";

import Menu from "../../parts/Menu.jsx";
import Containers, {toolDefn as dockerComposeToolDefn} from "./Containers.jsx";
import Build, {toolDefn as buildToolDefn} from "./Build.jsx";



export const toolDefn = {
    "title": "Documentation: Demo Notes",
    "description": <span><b>Documentation</b>: Demo Notes</span>,
    "toolDocs": null,
    "className": "Notes",
};

function Notes() {
    const menu = {
        "build": {"label": "Build", 'toolDefn': buildToolDefn, 'page': (<Build/>)},
        "containers": {"label": "Docker Containers", 'toolDefn': dockerComposeToolDefn, 'page': (<Containers/>)},
    };

    const [pageName, setPageName] = useState('build');

    const menuHandler = (item) => {
        setPageName(item);
    }

    let pageDefn = menu[pageName];
    return (
        <div className={appCSS.app}>
            <Menu handler={menuHandler} menu={menu} selectedMenuName={pageName}/>
            <div>
                <hr/>
                <div>
                    {pageDefn.page}
                </div>
            </div>
            {pageDefn.toolDefn.toolDocs}
        </div>
    )
}

export default Notes;
