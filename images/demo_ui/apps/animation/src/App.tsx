import './App.css'
import Paint from "./Paint.tsx";
import {KMPaint} from "./canvas/KMPaint.ts";

function App({kmPaint}: {kmPaint: KMPaint}) {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const back = queryParams.get('back');
    let backElement = <></>;
    if (back) {
        backElement = (
            <input type="button"
                   onClick={() => window.location.assign(back)} value="Back to playground"
                   style={{background: "yellow"}}
            />
        );
    }


    return (
        <div className="flexvdisplay fill" style={{inset: "50px"}}>
            {backElement}
            <div className="flexfixed" style={{height: "20px"}}></div>
            <div className="flexhdisplay flexvfill">
                <div className="flexfixed" style={{width: "20px"}}></div>
                <Paint kmSpreadSheet={kmPaint}></Paint>
                <div className="flexfixed" style={{width: "20px"}}></div>
            </div>
            <div className="flexfixed" style={{height: "20px"}}></div>
        </div>
    );
}

export default App
