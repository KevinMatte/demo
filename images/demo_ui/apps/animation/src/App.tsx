import '@/App.css'
import PaintApp from "./PaintApp.tsx";

function App() {
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
        <>
            <div className="flexVDisplay fill">
                <div className="flexFixed">
                    {backElement}: This is WIP. Nothing here to see. :-)
                </div>
                <div className="flexVFill">
                    <PaintApp/>
                </div>
            </div>
        </>
    );
}

export default App
