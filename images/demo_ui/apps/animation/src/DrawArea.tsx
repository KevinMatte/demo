import {useEffect, useId, useRef, useState} from "react";
import {KMPaint} from "./canvas/KMPaint.ts";

export function DrawArea(
    {topX, topY, ...props}: { className: string, topX: number, topY: number }
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const id = useId()

    function createKMPaint() {
        return new KMPaint();
    }

    const [kmPaint, _setKMPaint] = useState(createKMPaint);

    useEffect(() => {
        if (canvasRef.current) {
            kmPaint.setProps(canvasRef.current, topX, topY);
        }
    }, []);

    return (
        <div id="DrawAreaCanvas" className="fill">
            <canvas id={id} ref={canvasRef} {...props}>Support for HTML Canvas required.</canvas>
        </div>
    );
}