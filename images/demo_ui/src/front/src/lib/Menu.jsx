import menuCss from "./css/Menu.module.css";
import {useState} from "react";
import MenuButton from "./MenuButton.jsx";

export default function Menu({menu, handler}) {
    const [page, setPage] = useState('purpose');

    const handleClick = (buttonName) => {
        setPage(buttonName);
        handler(buttonName);
    }

    return (
        <div>
            <div className={menuCss.menu}>
                {Object.keys(menu).map(name => {
                        let item = menu[name];
                        return (<MenuButton
                            handler={handleClick}
                            name={name}
                            key={name}
                            selected={page}
                            title={item.toolDefn.title}
                        >
                            {item.label}
                        </MenuButton>);
                    }
                )}
            </div>
        </div>
    )
}
