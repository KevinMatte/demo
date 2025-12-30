import {useEffect, useId, useRef, useState} from "react";
import {LineDrawer} from "./LineDrawer.ts";

export const DrawEnum = {
    line: "line",
    circle: "circle",
} as const;
export type DrawType = typeof DrawEnum[keyof typeof DrawEnum];


export function PaintArea({topX, topY, drawType, ...props}:
    {
        className: string,
        drawType: DrawType,
        topX: number,
        topY: number,
        [_prop: string]: any
    }
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const id = useId()

    function createDrawer() {
        switch (drawType) {
            case "line": return new LineDrawer();
            case "circle":  return new LineDrawer();
            default: return new LineDrawer();
        }
    }

    const [drawer, _setDrawer] = useState(createDrawer);

    useEffect(() => {
        if (canvasRef.current) {
            drawer.setProps(canvasRef.current, topX, topY);
        }
        return () => {
            drawer.destroy();
        }
    }, []);

    return (
        <div id="DrawAreaCanvas" className="fill">
            <canvas id={id} ref={canvasRef} {...props}>Support for HTML Canvas required.</canvas>
        </div>
    );
}