import menuCss from "@/parts/css/Menu.module.css";
import MenuButton from "@/parts/MenuButton.jsx";
import React from "react";

const toolDefn = {
    "title": "Documentation: Demo Menu",
    "description": <span><b>Documentation</b>: Demo Overview</span>,
};

function MenuSummary({menu, handleClick, key: _key}) {
    let rows = [];
    for (let name in menu) {
        let item = menu[name];
        rows.push(
            <div style={{display: "table-row"}} key={`${name}_r1`} className={menuCss.menu}>
                <div style={{display: "table-cell"}}>
                    <div style={{float: "right", margin: "2px"}}>
                        <MenuButton
                            handler={() => handleClick(menu, name)}
                            name={name}
                            key={`${name}_button`}
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
        )
        rows.push(
            <div style={{display: "table-row"}} key={`${name}_r2`} className={menuCss.menu}>
                <div style={{display: "table-cell"}}>
                </div>
                <div style={{
                    display: "table-cell",
                    verticalAlign: "middle"
                }}>{item.toolDefn.summary || 'No summary'}</div>
            </div>
        );
    }
    return (
        <>
            <div style={{display: "table"}}>
                {...rows}
            </div>
        </>
    )
}

export {toolDefn}
export default MenuSummary;
