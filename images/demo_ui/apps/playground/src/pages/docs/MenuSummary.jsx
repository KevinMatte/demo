import menuCss from "@/parts/css/Menu.module.css";
import MenuButton from "@/parts/MenuButton.jsx";
import React from "react";

export const toolDefn = {
    "title": "Documentation: Demo Menu",
    "description": <span><b>Documentation</b>: Demo Overview</span>,
    "toolDocs": null,
};

function MenuSummary({menu, handleClick}) {
    return (
        <ul>
            <div style={{display: "table"}}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (
                            <div style={{display: "table-row"}} key={name} className={menuCss.menu}>
                                <div style={{display: "table-cell"}}>
                                    <div style={{float: "right", margin: "2px"}}>
                                        <MenuButton
                                            handler={() => handleClick(name)}
                                            name={name}
                                            key={name}
                                            title={item.toolDefn.title}
                                            selected={name === 'overview'}
                                        >
                                            {item.label}
                                        </MenuButton>

                                    </div>
                                </div>
                                <div style={{
                                    display: "table-cell",
                                    verticalAlign: "middle"
                                }}>{item.toolDefn.description || item.toolDefn.title}</div>
                            </div>
                        );
                    }
                )}
            </div>
        </ul>
    )
}

export default MenuSummary;
