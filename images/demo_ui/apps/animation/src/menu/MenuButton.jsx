import menuCss from "./css/Menu.module.css";

export default function MenuButton(
    {
        handler, label, name, selected, title, children,
        ...buttonProps
    }) {
    return (
        <button className={selected ? menuCss.selected : ""}
                onClick={() => handler(name)}
                title={title}
                {...buttonProps}
        >
            {children || label}
        </button>
    )
}
