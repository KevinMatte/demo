import menuCss from "./css/Menu.module.css";

export default function MenuButton(props) {
    let {handler, label, name, selected, url, title, children, ...buttonProps} = props;
    const handleClick = () => {
        if (url)
            window.open(url, "_self");
        handler(name);
    }
    return (
        <button className={selected ? menuCss.selected : ""}
                onClick={() => handleClick(name)}
                title={title}
                {...buttonProps}
        >
            {children || label}
        </button>
    )
}
