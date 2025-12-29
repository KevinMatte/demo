import './App.css'
import {useRef, useState} from 'react';
import './canvas/css/Paint.css'
import {DrawArea} from "./DrawArea.tsx";

function Paint() {
    const vscrollRef = useRef<HTMLCanvasElement>(null);
    const hscrollRef = useRef<HTMLCanvasElement>(null);
    const [x, _setX] = useState(0);
    const [y, _setY] = useState(0);

    return (
        <div className="fill flexVDisplay">
            <div className="flexHDisplay flexVFill">
                <div id="div4DrawArea" className="flexHFill" style={{overflow: 'hidden'}}>
                    <DrawArea className="fill" topX={x} topY={y}></DrawArea>
                </div>
                <div className="flexFixed">
                    <canvas ref={vscrollRef} className="km_spd_row_scroll"></canvas>
                </div>
            </div>
            <div className="flexFixed flexHDisplay">
                <canvas ref={hscrollRef} className="flexHFill km_spd_col_scroll km_spd_scroll_thickness"></canvas>
                {/*Bottom right space*/}
                <div className="flexFixed km_spd_scroll_thickness"></div>
            </div>
        </div>
    )
}

export default Paint;

