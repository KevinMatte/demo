import './css/App.css'
import './css/styles.css'

function App() {
  return (
    <div>
        <h1>Playground/Demo Project</h1>

        <p><b>Project Location</b>: <a target="km_github" href="https://github.com/KevinMatte/demo">https://github.com/KevinMatte/demo</a></p>

        <h2>Purpose</h2>
        <ul>
            <li>For myself:
                <ul>
                    <li>Progressively review and exercise a selection of technologies from my resume.</li>
                </ul>
            </li>
            <li>For others:
                <ul>
                    <li>Demonstrate my code and abilities.</li>
                </ul>
            </li>
            <li>Note: For this study, I'm not using existing frameworks.
            <ul>
                <li>A bare-bones React was integrated using bare npx vite commands</li>
                <li>I wrote my own file monitor to redo builds in a development environment.</li>
            </ul>

            </li>
        </ul>

        <h2>Pages</h2>
        <ul>
            <li><a target="_self" href="/">React (HTML/TypeScript): Hello World</a></li>
            <li><a target="_self" href="/py_app/hello_world.py">Python WSGI: Hello World</a></li>
            <li><a target="_self" href="/hello_world.php">PHP: Hello World</a></li>
        </ul>
    </div>
  )
}

export default App
