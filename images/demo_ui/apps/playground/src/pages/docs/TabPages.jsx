import React, {useState} from 'react';
import appCSS from "@/css/App.module.css";

import Menu from "@/parts/Menu.jsx";


export const toolDefn = {
    "title": "Documentation: Demo TabPages",
    "description": <span><b>Documentation</b>: Demo Notes</span>,
    "className": "TabPages",
};

function TabPages({tabMenu, key: _key}) {
    let initialPageName = Object.keys(tabMenu)[0];
    let [pageName, setPageName] = useState(initialPageName);

    let menuHandler = (menu, itemName) => {
        setPageName(itemName);
    }

    let pageDefn = tabMenu[pageName];
    return (
        <div className={appCSS.app}>
            <div style={{margin: "20px"}}>
                <Menu handler={menuHandler} menu={tabMenu} selectedMenuName={pageName}/>
            </div>
            {pageDefn.page}
        </div>
    )
}

export default TabPages;
