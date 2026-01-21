import '@/App.css'
import {useState} from 'react';
import {PaintArea, DrawEnum} from "./canvas/PaintArea.tsx";
import ScrollBar from "./canvas/ScrollBar.tsx";
import {Orientation} from "./canvas/ScrollBar.tsx";
import ImageHolder from "./canvas/ImageHolder.ts";
import ImageContext from "./canvas/ImageContext.ts";
import Stretch from "./utils/Stretch.tsx";

function PaintApp() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
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

    function scrollBarListener(onX: boolean, pos: number) {
        if (onX)
            setX(pos);
        else
            setY(pos);
    }

    return (
        <ImageContext value={imageHolder}>
            <Stretch direction="column" className="fill">
                <Stretch direction="row" flex="1">
                    <Stretch id="div4DrawArea" direction="column" style={{overflow: 'hidden'}}>
                        <PaintArea className="fill" drawType={DrawEnum.line} topX={x} topY={y}></PaintArea>
                    </Stretch>
                    <ScrollBar extraClassNames="flexFixed" orientation={Orientation.vertical}
                               listener={scrollBarListener} style={leftLineStyle}/>
                </Stretch>
                <Stretch direction="row" style={topLineStyle}>
                    <ScrollBar extraClassNames="flexHFill" orientation={Orientation.horizontal}
                               listener={scrollBarListener}/>
                    <Stretch className="km_spd_scroll_thickness" style={{background: 'grey'}}></Stretch>
                </Stretch>
            </Stretch>
        </ImageContext>
    )
}

export default PaintApp;

