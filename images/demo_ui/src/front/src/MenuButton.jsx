import menuCss from "./css/Menu.module.css";

export default function MenuButton({handler, label, name, selected, url, title, children}) {
    const handleClick = (name) => {
        if (url)
            window.open(url, "_self");
        handler(name);
    }
    return (
        <button className={name === selected ? menuCss.selected : ""}
                onClick={() => handleClick(name)}
                title={title}
        >
            {children || label}
        </button>
    )
}
