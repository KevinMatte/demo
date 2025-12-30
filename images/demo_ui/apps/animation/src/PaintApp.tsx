import '@/App.css'
import {createContext, useState} from 'react';
import {PaintArea, DrawEnum} from "./canvas/PaintArea.tsx";
import ScrollBar from "./canvas/ScrollBar.tsx";
import {Orientation} from "./canvas/ScrollBar.tsx";
import ImageHolder from "./canvas/ImageHolder.ts";

function PaintApp() {
    const [x, _setX] = useState(0);
    const [y, _setY] = useState(0);
    const topLineStyle = {
        borderStyle: "solid",
        borderWidth: "1px 0 0 0",
    }
    const leftLineStyle = {
        borderStyle: "solid",
        borderWidth: "0 0 0 1px",
    }
    function createImageHolder() {
        return new ImageHolder();
    }

    const [imageHolder, _setImageHolder] = useState<ImageHolder>(createImageHolder);
    const ImageContext = createContext<ImageHolder>(imageHolder);

    return (
        <ImageContext value={imageHolder}>
        <div className="fill flexVDisplay">
            <div className="flexHDisplay flexVFill">
                <div id="div4DrawArea" className="flexHFill" style={{overflow: 'hidden'}}>
                    <PaintArea className="fill" drawType={DrawEnum.line} topX={x} topY={y}></PaintArea>
                </div>
                <ScrollBar extraClassNames="flexFixed" orientation={Orientation.vertical} style={leftLineStyle}/>
            </div>
            <div className="flexFixed flexHDisplay" style={topLineStyle}>
                <ScrollBar extraClassNames="flexHFill" orientation={Orientation.horizontal}/>
                {/*Bottom right space*/}
                <div className="flexFixed km_spd_scroll_thickness" style={{background: 'grey'}}></div>
            </div>
        </div>
        </ImageContext>
    )
}

export default PaintApp;

