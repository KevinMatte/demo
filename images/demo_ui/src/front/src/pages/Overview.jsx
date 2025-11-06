import React from "react";
import menuCss from "../lib/css/Menu.module.css";

export const toolDefn = {
    "title": "Summary of this demo",
    "toolDocs": null,
};

function Overview({menu}) {

    return (
        <div>
            <h2>Purpose</h2>
            <ul>
                <li>For myself:</li>
                <ul>
                    <li>Progressively review and exercise a selection of technologies from my resume.</li>
                </ul>
                <li>For others:
                </li>
                <ul>
                    <li>Demonstrate my code and abilities.</li>
                </ul>
                <li>Note: For this study, I'm not using existing frameworks.
                    <ul>
                        <li>A bare-bones React was integrated using bare npx vite commands</li>
                        <li>I wrote my own file monitor to redo builds in a development environment.</li>
                    </ul>

                </li>
            </ul>

            <h2>Menu</h2>
            <ul>
                <div style={{display: "table"}}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (
                            <div style={{display: "table-row"}}>
                                <div style={{display: "table-cell"}}>
                                    <span style={{float: "right", margin: "2px"}} className={menuCss.menuButton}>{item.label}</span>
                                </div>
                                <div style={{display: "table-cell", verticalAlign: "middle"}}>{item.toolDefn.title}</div>
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
