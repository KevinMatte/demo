import '@/App.css'
import PaintApp from "./PaintApp.tsx";
import {Button} from '@mui/material';
import Stretch from "./utils/Stretch.tsx";

function App() {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const back = queryParams.get('back');
    let backElement = <></>;
    if (back) {
        backElement = (
            <Button
                onClick={() => window.location.assign(back)} value=""
                style={{background: "yellow"}}
            >
                Back to playground
            </Button>
        );
    }

    return (
        <>
            <Stretch id='kevin' direction="column" className="fill">
                {/*<div className="flexVDisplay fill">*/}
                <Stretch>
                    {backElement}: This is WIP. Nothing here to see. :-)
                </Stretch>
                <Stretch flex="1">
                    <PaintApp/>
                </Stretch>
                {/*</div>*/}
            </Stretch>
        </>
    );
}

export default App
