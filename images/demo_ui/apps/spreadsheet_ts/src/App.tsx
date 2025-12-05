import './App.css'
import Spreadsheet from "./Spreadsheet.tsx";

function App() {

  return (
      <div className="flexvdisplay fill" style={{inset: "50px"}}>
          <div className="flexfixed" style={{height: "20px"}}></div>
          <div className="flexhdisplay flexvfill">
              <div className="flexfixed" style={{width: "20px"}}></div>
                  <Spreadsheet></Spreadsheet>
              <div className="flexfixed" style={{width: "20px"}}></div>
          </div>
          <div className="flexfixed" style={{height: "20px"}}></div>
      </div>
    );
}

export default App
