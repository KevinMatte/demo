import menuCss from "./css/Menu.module.css";
import {useState} from "react";
import MenuButton from "./MenuButton.jsx";

export default function Menu({menu, handler}) {
    const [page, setPage] = useState('purpose');

    const handleClick = (buttonName) => {
        setPage(buttonName);
        handler(buttonName);
    }

    // <MenuButton handler={handleClick} label="{item.label}" name="{item.name}" selected={page}></MenuButton>
    const rMenu = menu.map(item =>
        (<MenuButton
            handler={handleClick}
            name={item.name}
            key={item.name}
            selected={page}
            title={item.title}
        >
            {item.label}
        </MenuButton>)
    );
    return (
        <div>
            <div className={menuCss.menu}>
                {rMenu}
            </div>
        </div>
    )
}
