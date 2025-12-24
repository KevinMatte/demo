import './App.css'
import Spreadsheet from "./Spreadsheet.tsx";
import {KMSpreadsheet} from "./canvas/KMSpreadsheet.ts";

function App({kmSpreadSheet}: {kmSpreadSheet: KMSpreadsheet}) {
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
                <Spreadsheet kmSpreadSheet={kmSpreadSheet}></Spreadsheet>
                <div className="flexfixed" style={{width: "20px"}}></div>
            </div>
            <div className="flexfixed" style={{height: "20px"}}></div>
        </div>
    );
}

export default App
