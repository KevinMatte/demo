import React from "react";

import CPP, {toolDefn as cppToolDefn} from '@/pages/simple_demos/CPP.jsx';
import Python, {toolDefn as pythonToolDefn} from '@/pages/simple_demos/Python.jsx';
import PHP, {toolDefn as phpToolDefn} from '@/pages/simple_demos/PHP.jsx';
import Java, {toolDefn as javaToolDefn} from '@/pages/simple_demos/Java.jsx';

const menus_wirings = {
    "cpp_hello": {"label": "C++", 'toolDefn': cppToolDefn, 'page': (<CPP/>)},
    "python_hello": {"label": "Python", 'toolDefn': pythonToolDefn, 'page': (<Python/>)},
    "php_hello": {"label": "PHP", 'toolDefn': phpToolDefn, 'page': (<PHP/>)},
    "java_hello": {"label": "Java", 'toolDefn': javaToolDefn, 'page': (<Java/>)},
};

let isDevVite = window.location.host === 'localhost:5173';
let pathname = window.location.pathname;
const menus_apps = {
    "spreadsheet": {
        label: "Sheet.jsx",
        url: (isDevVite && pathname !== '/spreadsheet') ?
            'http://localhost:8080/spreadsheet' : '/spreadsheet',
        prefix: <><h3>Spread Sheets Implementations:</h3>&nbsp;&nbsp;&nbsp;&nbsp; </>,
        toolDefn: {
            description: <><b>App: </b>Spreadsheet written in JavaScript</>
        }
    },
    "spreadsheet_ts": {
        "label": "Sheet.tsx",
        'url': (isDevVite && pathname !== '/spreadsheet_ts') ?
            'http://localhost:8080/spreadsheet_ts' : '/spreadsheet_ts',
        toolDefn: {
            description: <><b>App: </b>Spreadsheet converted to TypeScript</>
        }
    },
    "animation": {
        "label": "2DAdmination",
        'url': (isDevVite && pathname !== '/animation') ?
            'http://localhost:8080/animation' : '/animation',
        toolDefn: {
            description: <><b>App: </b>2D Animation App beginning</>
        }
    },
}

export {menus_wirings, menus_apps};