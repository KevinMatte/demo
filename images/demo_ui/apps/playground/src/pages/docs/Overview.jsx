import menuCss from "../../parts/css/Menu.module.css";
import MenuButton from "../../parts/MenuButton.jsx";
import {Anchor} from "../../parts/Anchors.jsx";
import React from "react";

export const toolDefn = {
    "title": "Documentation: Demo Overview",
    "description": <span><b>Documentation</b>: Demo Overview</span>,
    "toolDocs": null,
};

function Overview({menu, handleClick}) {
    return (
        <div>
            YouTube:
            <Anchor path="https://youtu.be/Jd9BgYf0lW8">Playground Quick Tour</Anchor>

            <h2>Menu</h2>
            <ul>
                <div style={{display: "table"}}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (
                            <div style={{display: "table-row"}} key={name}  className={menuCss.menu}>
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
                                <div style={{display: "table-cell", verticalAlign: "middle"}}>{item.toolDefn.description || item.toolDefn.title}</div>
                            </div>
                        );
                    }
                )}
                </div>
            </ul>
        </div>
    )
}

export default Overview;
