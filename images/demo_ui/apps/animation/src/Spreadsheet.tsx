// import './App.css'
// import { useRef, useEffect, useState } from 'react';
//
import {useRef, useEffect, useState} from 'react';
import './canvas/css/KMSpreadsheet.css'
import {KMSpreadsheet} from "./canvas/KMSpreadsheet.ts";

function Spreadsheet({kmSpreadSheet}: {kmSpreadSheet: KMSpreadsheet}) {
    const spreadSheetRef = useRef<HTMLCanvasElement>(null);
    const vscrollRef = useRef<HTMLCanvasElement>(null);
    const hscrollRef = useRef<HTMLCanvasElement>(null);
    const [isResized, setIsResized] = useState(false);
    const [_kmSpreadsheet, setKMSpreadsheet] = useState<KMSpreadsheet|null>(null);

    useEffect(() => {
        const canvas: any = spreadSheetRef.current as HTMLCanvasElement;

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };


        window.addEventListener('resize', handleResize);
        if (!isResized) {
            setIsResized(true);
            handleResize();
            if (spreadSheetRef.current && hscrollRef.current && vscrollRef.current) {
                kmSpreadSheet.setCanvases(spreadSheetRef.current,
                    hscrollRef.current,
                    vscrollRef.current);
                setKMSpreadsheet(kmSpreadSheet);
            }
        }

        return () => {};
    }, [isResized]); // Dependencies ensure redraw when drawing state changes

    // return (
    //     <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }}></canvas>
    // );
    return (
        <>
            <div id="spreadsheet" className="km_spd_cell flexhfill" style={{border: '1px solid black'}}>
                <canvas ref={spreadSheetRef} className="km_spd_canvas fill">Support for HTML Canvas required.</canvas>
                <canvas ref={vscrollRef} className="km_spd_row_scroll km_spd_scroll_width"></canvas>
                <canvas ref={hscrollRef} className="km_spd_col_scroll km_spd_scroll_height"></canvas>
            </div>
        </>
    )
}

export default Spreadsheet;

