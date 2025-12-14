import menuCss from "./css/Menu.module.css";
import MenuButton from "./MenuButton.jsx";

export default function Menu(props) {
    const {menu, handler, selectedMenuName, ...menuProps} = props;

    function loadUrl(item, name) {
        if (!item.page && item.url) {
            let url = `${item.url}?back=${encodeURIComponent(window.location.href)}`;
            window.location.assign(url);
        } else
            handler(name);
    }

    return (
        <div>
            <div className={menuCss.menu}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (
                            <MenuButton
                                handler={() => loadUrl(item, name)}
                                name={name}

                                selected={name === selectedMenuName}
                                title={item.toolDefn && item.toolDefn.title}
                                {...menuProps}
                            >
                                {item.label}
                            </MenuButton>
                        );
                    }
                )}
            </div>
        </div>
    )
}
