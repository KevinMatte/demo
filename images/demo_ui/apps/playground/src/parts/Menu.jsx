import menuCss from "./css/Menu.module.css";
import MenuButton from "./MenuButton.jsx";
import {useState} from "react";


export default function Menu(props) {
    const {menu, handler, selectedMenuName, ...menuProps} = props;
    let [pageName, setPageName] = useState(selectedMenuName);

    function getItemRenderer(menu, name, props) {
        let {handler, menuProps} = props;
        let item = menu[name];
        return (
            <MenuButton
                handler={() => {
                    setPageName(name);
                    handler(menu, name);
                }}
                name={name}
                key={name}
                selected={name === pageName}
                title={item.toolDefn && item.toolDefn.title}
                {...menuProps}
            >
                {item.label}
            </MenuButton>
        );
    }

    return (
        <div className={menuCss.menuBar}>
            <div className={menuCss.menu}>
                {Object.keys(menu).map(name => {
                        return getItemRenderer(menu, name, {handler, ...menuProps, isSelected: name === pageName});
                    }
                )}
            </div>
        </div>
    )
}
