import type {ReactNode} from "react";

export default function Shelf({direction, flex, style, children, ...props}:
                                {
                                    direction?: string,
                                    flex?: string,
                                    style?: object,
                                    children?: ReactNode,
                                    [_prop: string]: any
                                }) {
    // Take caller's style
    style = style ? Object.assign({}, style) : {};
    if (direction)
        style = Object.assign({}, style, {display: 'flex', flexWrap: 'nowWrap', flexDirection: direction});
    if (flex && flex !== '0')
        style = Object.assign({}, style, {flex, overflow: 'auto', alignItems: 'stretch'});

    return (
        <div style={style} {...props}>
            {children}
        </div>
    )
}
