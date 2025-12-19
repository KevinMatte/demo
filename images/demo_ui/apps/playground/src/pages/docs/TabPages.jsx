import React, {useState} from 'react';
import appCSS from "@/css/App.module.css";

import Menu from "@/parts/Menu.jsx";


export const toolDefn = {
    "title": "Documentation: Demo TabPages",
    "noTitle": true,
    "description": <span><b>Documentation</b>: Demo Notes</span>,
    "toolDocs": null,
    "className": "TabPages",
};

function TabPages({tabMenu}) {
    const [pageName, setPageName] = useState(Object.keys(tabMenu)[0]);

    const menuHandler = (item) => {
        setPageName(item);
    }

    let pageDefn = tabMenu[pageName];
    return (
        <div className={appCSS.app}>
            <div style={{margin: "20px"}}>
                <Menu handler={menuHandler} menu={tabMenu} selectedMenuName={pageName}/>
            </div>
            <div>
                {pageDefn.page}
            </div>
            {pageDefn.toolDefn.toolDocs}
        </div>
    )
}

export default TabPages;
