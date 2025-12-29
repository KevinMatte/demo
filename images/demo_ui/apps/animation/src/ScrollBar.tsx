import './canvas/css/Paint.css'
import {useEffect, useId, useRef, useState} from "react";
import KMScrollbar from "./canvas/KMScrollbar.ts";

// 1. Define the constant values using an object literal and 'as const'
export const Orientation = {
    horizontal: "km_spd_col_scroll",
    vertical: "km_spd_row_scroll",
} as const;

// 2. Create a union type from the values of the object
export type OrientationType = typeof Orientation[keyof typeof Orientation];

function ScrollBar(
    {
        orientation,
        extraClassNames
    }:
    {
        orientation: OrientationType,
        extraClassNames: string
    }
) {
    const classNames = `${extraClassNames} ${orientation}`;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const id = useId()

    function createKMScrollbar() {
            return new KMScrollbar(
                null,
                orientation === Orientation.horizontal,
                (pos) => {
                    console.log(`${orientation}: ${pos}`);
                },
                0,
                100,
            );
    }

    const [kmScrollbar, _setKMScrollbar] = useState(createKMScrollbar);

    useEffect(() => {
        if (canvasRef.current) {
            kmScrollbar.setCanvas(canvasRef.current);
        }
    }, []);


    return (
        <canvas id={id} ref={canvasRef} className={classNames} style={{background: "yellow"}}></canvas>
    )
}

export default ScrollBar;
