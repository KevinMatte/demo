import type {ReactNode} from "react";

export default function Shelf({direction, flex, style, fill, children, ...props}:
                                {
                                    direction?: string,
                                    flex?: string,
                                    style?: object,
                                    children?: ReactNode,
                                    fill?: boolean,
                                    [_prop: string]: any
                                }) {
    // Take caller's style
    style = style ? Object.assign({}, style) : {};
    if (direction)
        style = Object.assign({}, style, {display: 'flex', flexWrap: 'nowWrap', flexDirection: direction});
    if (flex && flex !== '0')
        style = Object.assign({}, style, {flex, overflow: 'auto', alignItems: 'stretch'});
    if (fill)
        style = Object.assign({}, style, {width: "100%", height: "100%"});

    return (
        <div style={style} {...props}>
            {children}
        </div>
    )
}
