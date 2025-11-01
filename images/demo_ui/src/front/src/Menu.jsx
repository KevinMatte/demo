import menuCss from "./css/Menu.module.css";
import {useState} from "react";
import MenuButton from "./MenuButton.jsx";

export default function Menu({handler}) {
    const [page, setPage] = useState('purpose');

    const handleClick = (item) => {
        console.log(item);
        setPage(item);
        handler(item);
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
