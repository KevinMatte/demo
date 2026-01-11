import {useEffect, useId, useRef, useState} from "react";
import {PenDrawer} from "./PenDrawer.ts";
import {useContext} from "react";
import ImageContext from "./ImageContext.ts";

export const DrawEnum = {
    line: "line",
    circle: "circle",
} as const;
export type DrawType = typeof DrawEnum[keyof typeof DrawEnum];


export function PaintArea({topX, topY, drawType, ...props}:
                          {
                              drawType: DrawType,
                              topX: number,
                              topY: number,
                              [_prop: string]: any
                          }
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const id = useId()
    const imageHolder = useContext(ImageContext);

    function createDrawer() {
        if (!imageHolder)
            return null;

        let drawer: PenDrawer|null;
        switch (drawType) {
            case "line":
                drawer = new PenDrawer(imageHolder);
                break;
            default:
                drawer = null;
                break;
        }
        return drawer;
    }

    const [drawer, _setDrawer] = useState(createDrawer);

    useEffect(() => {
        if (canvasRef.current && drawer) {
            drawer.setProps(canvasRef.current, topX, topY);
        }
        return () => {
            if (drawer)
                drawer.destroy();
        }
    }, []);

    return (
        <div id="DrawAreaCanvas" className="fill">
            <canvas id={id} ref={canvasRef} {...props}>Support for HTML Canvas required.</canvas>
        </div>
    );
}