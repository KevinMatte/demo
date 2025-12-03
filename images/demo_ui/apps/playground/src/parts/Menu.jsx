import menuCss from "./css/Menu.module.css";
import MenuButton from "./MenuButton.jsx";

export default function Menu(props) {
    const {menu, handler, selectedMenuName, ...menuProps} = props;
    return (
        <div>
            <div className={menuCss.menu}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (<MenuButton
                            handler={() => handler(name)}
                            name={name}
                            key={name}
                            selected={name === selectedMenuName}
                            title={item.toolDefn.title}
                            {...menuProps}
                        >
                            {item.label}
                        </MenuButton>);
                    }
                )}
            </div>
        </div>
    )
}
