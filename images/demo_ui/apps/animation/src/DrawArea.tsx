import {useEffect, useId, useRef, useState} from "react";
import {KMPaint} from "./canvas/KMPaint.ts";

export function DrawArea(
    {topX, topY, ...props}: { className: string, topX: number, topY: number }
) {
    const drawPanelRef = useRef<HTMLCanvasElement>(null);
    const id = useId()

    function createKMPaint() {
        return new KMPaint();
    }

    const [kmPaint, _setKMPaint] = useState(createKMPaint);

    useEffect(() => {
        if (drawPanelRef.current) {
            kmPaint.setProps(drawPanelRef.current, topX, topY);
        }
    }, []);

    return (
        <canvas id={id} ref={drawPanelRef} {...props}>Support for HTML Canvas required.</canvas>
    );
}