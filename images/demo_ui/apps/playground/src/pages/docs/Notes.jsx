import React, {useState} from 'react';
import appCSS from "../../css/App.module.css";

import Menu from "../../parts/Menu.jsx";
import Overview, {toolDefn as overviewToolDefn} from './Overview.jsx';
import Build, {toolDefn as buildToolDefn} from "./Build.jsx";
import Containers, {toolDefn as dockerComposeToolDefn} from "./Containers.jsx";



export const toolDefn = {
    "title": "Documentation: Demo Notes",
    "noTitle": true,
    "description": <span><b>Documentation</b>: Demo Notes</span>,
    "toolDocs": null,
    "className": "Notes",
};

function Notes({menu, handleClick}) {
    const notesMenu = {
        "overview": {"label": "Overview", 'toolDefn': overviewToolDefn, 'page': null },
        "build": {"label": "Build", 'toolDefn': buildToolDefn, 'page': (<Build/>)},
        "containers": {"label": "Docker Containers", 'toolDefn': dockerComposeToolDefn, 'page': (<Containers/>)},
    };
    notesMenu.overview.page = (<Overview menu={menu} handleClick={handleClick}/>);

    const [pageName, setPageName] = useState('overview');

    const menuHandler = (item) => {
        setPageName(item);
    }

    let pageDefn = notesMenu[pageName];
    return (
        <div className={appCSS.app}>
            <div style={{margin: "20px"}}>
                <Menu handler={menuHandler} menu={notesMenu} selectedMenuName={pageName}/>
            </div>
            <div>
                {pageDefn.page}
            </div>
            {pageDefn.toolDefn.toolDocs}
        </div>
    )
}

export default Notes;
