import '@/App.css'
import {useState} from 'react';
import {PaintArea, DrawEnum} from "./canvas/PaintArea.tsx";
import ScrollBar from "./canvas/ScrollBar.tsx";
import {Orientation} from "./canvas/ScrollBar.tsx";
import ImageHolder from "./canvas/ImageHolder.ts";
import ImageContext from "./canvas/ImageContext.ts";
import Shelf from "./utils/Shelf.tsx";

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
            <Shelf direction="column" fill>
                <Shelf direction="row" flex="1">
                    <Shelf id="kevin" direction="column" fill
                           style={{overflow: 'hidden'}}
                    >
                        <PaintArea className="fill" drawType={DrawEnum.line} topX={x} topY={y}></PaintArea>
                    </Shelf>
                    <ScrollBar extraClassNames="flexFixed" orientation={Orientation.vertical}
                               listener={scrollBarListener} style={leftLineStyle}/>
                </Shelf>
                <Shelf direction="row" style={topLineStyle}>
                    <ScrollBar extraClassNames="flexHFill" orientation={Orientation.horizontal}
                               listener={scrollBarListener}/>
                    <Shelf className="km_spd_scroll_thickness" style={{background: 'grey'}}></Shelf>
                </Shelf>
            </Shelf>
        </ImageContext>
    )
}

export default PaintApp;

