import './css/App.css'
import './css/styles.css'

export default function Menu({handler}) {
    const handleClick = (item) => {
        console.log(item);
        handler(item);
    }
    return (
        <div>
            <button onClick={() => handleClick("purpose")}>
                Purpose
            </button>
            <button onClick={() => handleClick("cpp_calc")}>
                C++ Calc
            </button>
            <button onClick={() => window.open("/py_app/hello_world.py", "_self")}>
                Python Hello
            </button>
            <button onClick={() => window.open("/hello_world.php", "_self")}>
                PHP Hello
            </button>
        </div>
    )
}
