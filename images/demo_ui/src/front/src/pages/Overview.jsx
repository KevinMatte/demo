import menuCss from "../parts/css/Menu.module.css";
import MenuButton from "../parts/MenuButton.jsx";
import DemoAnchor from "../parts/Anchors.jsx";

export const toolDefn = {
    "title": "Documentation: Demo Overview",
    "description": <span><b>Documentation</b>: Demo Overview</span>,
    "toolDocs": null,
};

function Overview({menu, handleClick}) {
    return (
        <div>


            <h2>Purpose {menuCss.menuButton}</h2>
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
            </ul>

            <p><b>Note:</b> This UI(<DemoAnchor label="App.jsx" path="images/demo_ui/src/front/src/App.jsx"/>) is fully <b>ReactJS</b>, my favorite UI environment.</p>

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
