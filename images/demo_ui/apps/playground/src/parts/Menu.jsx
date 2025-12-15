import menuCss from "./css/Menu.module.css";
import MenuButton from "./MenuButton.jsx";

function getItemRenderer(name, item, props) {
    let {handler, menuProps, isSelected} = props;
    return (
        <MenuButton
            handler={() => {
                if (!item.page && item.url) {
                    let url = `${item.url}?back=${encodeURIComponent(window.location.href)}`;
                    window.location.assign(url);
                } else
                    handler(name);
            }}
            name={name}
            key={name}
            selected={isSelected}
            title={item.toolDefn && item.toolDefn.title}
            {...menuProps}
        >
            {item.label}
        </MenuButton>
    );
}

export default function Menu(props) {
    const {menu, handler, selectedMenuName, ...menuProps} = props;

    return (
        <div>
            <div className={menuCss.menu}>
                {Object.keys(menu).map(name => {
                        return getItemRenderer(name, menu[name], {handler, ...menuProps, isSelected: name === selectedMenuName});
                    }
                )}
            </div>
        </div>
    )
}
