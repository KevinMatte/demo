import './App.css'
import {useState} from 'react';
import './canvas/css/Paint.css'
import {DrawArea} from "./DrawArea.tsx";
import ScrollBar from "./ScrollBar.tsx";
import {Orientation} from "./ScrollBar.tsx";

function Paint() {
    const [x, _setX] = useState(0);
    const [y, _setY] = useState(0);

    return (
        <div className="fill flexVDisplay">
            <div className="flexHDisplay flexVFill">
                <div id="div4DrawArea" className="flexHFill" style={{overflow: 'hidden'}}>
                    <DrawArea className="fill" topX={x} topY={y}></DrawArea>
                </div>
                <ScrollBar extraClassNames="flexFixed" orientation={Orientation.vertical}/>
            </div>
            <div className="flexFixed flexHDisplay">
                <ScrollBar extraClassNames="flexHFill" orientation={Orientation.horizontal}/>
                {/*Bottom right space*/}
                <div className="flexFixed km_spd_scroll_thickness"></div>
            </div>
        </div>
    )
}

export default Paint;

