import '@/App.css'
import ScrollLineDrawer from "./ScrollLineDrawer.tsx";

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
                    {backElement}
                </div>
                <div className="flexVFill">
                    <ScrollLineDrawer/>
                </div>
            </div>
        </>
    );
}

export default App
