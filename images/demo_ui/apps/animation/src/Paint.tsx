// import './App.css'
// import { useRef, useEffect, useState } from 'react';
//
import {useRef, useEffect, useState} from 'react';
import './canvas/css/Paint.css'
import {KMPaint} from "./canvas/KMPaint.ts";

function Paint({kmSpreadSheet}: {kmSpreadSheet: KMPaint}) {
    const drawPanelRef = useRef<HTMLCanvasElement>(null);
    const vscrollRef = useRef<HTMLCanvasElement>(null);
    const hscrollRef = useRef<HTMLCanvasElement>(null);
    const [isResized, setIsResized] = useState(false);

    useEffect(() => {
        const canvas: any = drawPanelRef.current as HTMLCanvasElement;

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        if (!isResized) {
            setIsResized(true);
            handleResize();
            if (drawPanelRef.current && hscrollRef.current && vscrollRef.current) {
                kmSpreadSheet.setCanvases(drawPanelRef.current,
                    hscrollRef.current,
                    vscrollRef.current);
            }
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isResized]); // Dependencies ensure redraw when drawing state changes

    return (
        <>
            <div className="km_spd_cell flexhfill" style={{border: '1px solid black'}}>
                <canvas ref={drawPanelRef} className="fill">Support for HTML Canvas required.</canvas>
                <canvas ref={vscrollRef} className="km_spd_scroll_width"></canvas>
                <canvas ref={hscrollRef} className="km_spd_scroll_height"></canvas>
            </div>
        </>
    )
}

export default Paint;

