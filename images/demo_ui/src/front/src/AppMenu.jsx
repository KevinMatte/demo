import menuCss from "./css/Menu.module.css";
import {useState} from "react";
import MenuButton from "./MenuButton.jsx";

export default function AppMenu({handler}) {
    const [page, setPage] = useState('purpose');

    const handleClick = (buttonName) => {
        console.log(buttonName);
        setPage(buttonName);
        handler(buttonName);
    }
    return (
        <div>
        <div className={menuCss.menu}>
            <MenuButton handler={handleClick} label="Purpose" name="purpose" selected={page}></MenuButton>
            <MenuButton handler={handleClick} label="C++ Calc" name="cpp_calc" selected={page}></MenuButton>
            <MenuButton handler={handleClick} label="Python Hello" name="python_hello" selected={page} url="/py_app/hello_world.py"></MenuButton>
            <MenuButton handler={handleClick} label="PHP Hello" name="php_hello" selected={page} url="/hello_world.php"></MenuButton>
        </div>
        </div>
    )
}
