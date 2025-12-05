// import './App.css'
// import { useRef, useEffect, useState } from 'react';
//
import { useRef, useEffect, useState } from 'react';
import './canvas/css/KMSpreadsheet.css'

function Spreadsheet() {
    const spreadSheetRef = useRef(null);
    const vscrollRef = useRef(null);
    const hscrollRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [isResized, setIsResized] = useState(false);

    useEffect(() => {
        const canvas: any = spreadSheetRef.current;
        if (!(canvas instanceof HTMLCanvasElement))
            return;

        const ctx = canvas.getContext('2d');

        const getMousePos = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        };

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };


        const startDrawing = (event: MouseEvent) => {
            setIsDrawing(true);
            setLastPosition(getMousePos(event));
        };

        const draw = (event: MouseEvent) => {
            if (!ctx || !isDrawing) return;
            const currentPos = getMousePos(event);

            ctx.beginPath();
            ctx.moveTo(lastPosition.x, lastPosition.y);
            ctx.lineTo(currentPos.x, currentPos.y);
            ctx.stroke();

            setLastPosition(currentPos);
        };

        const stopDrawing = () => {
            setIsDrawing(false);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves canvas
        window.addEventListener('resize', handleResize);
        if (!isResized) {
            setIsResized(true);
            handleResize();
        }

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        };
    }, [isDrawing, lastPosition]); // Dependencies ensure redraw when drawing state changes

    // return (
    //     <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }}></canvas>
    // );
    return (
        <>
            <div id="spreadsheet" className="km_spd_cell flexhfill"  style={{ border: '1px solid black' }}>
                <canvas ref={spreadSheetRef} className="km_spd_canvas fill">Support for HTML Canvas required.</canvas>
                <canvas ref={vscrollRef} className="km_spd_row_scroll km_spd_scroll_width"></canvas>
                <canvas ref={hscrollRef} className="km_spd_col_scroll km_spd_scroll_height"></canvas>
            </div>
        </>
    )
}

export default Spreadsheet;

