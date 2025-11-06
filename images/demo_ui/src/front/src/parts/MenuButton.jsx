import menuCss from "./css/Menu.module.css";
import extractProps from "../lib/Utils.jsx";

export default function MenuButton(props) {
    let parms = {
        handler: null,
        label: null,
        name: null,
        selected: null,
        url: null,
        title: null,
        children: null
    };
    let buttonProps = extractProps(props, parms);

    const handleClick = () => {
        if (parms.url)
            window.open(parms.url, "_self");
        parms.handler(parms.name);
    }
    return (
        <button className={parms.selected ? menuCss.selected : ""}
                onClick={() => handleClick(parms.name)}
                title={parms.title}
                {...buttonProps}
        >
            {parms.children || parms.label}
        </button>
    )
}
