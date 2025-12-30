import {useEffect, useId, useRef, useState} from "react";
import {CanvasLineDrawer} from "./canvas/CanvasLineDrawer.ts";

export function LineDrawer(
    {topX, topY, ...props}: { className: string, topX: number, topY: number }
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const id = useId()

    function createLineDrawer() {
        return new CanvasLineDrawer();
    }

    const [lineDrawer, _setLineDrawer] = useState(createLineDrawer);

    useEffect(() => {
        if (canvasRef.current) {
            lineDrawer.setProps(canvasRef.current, topX, topY);
        }
    }, []);

    return (
        <div id="DrawAreaCanvas" className="fill">
            <canvas id={id} ref={canvasRef} {...props}>Support for HTML Canvas required.</canvas>
        </div>
    );
}