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
    "spreadsheet_ts": {
        "label": "Sheet.tsx",
        'url': (isDevVite && pathname !== '/spreadsheet_ts') ?
            'http://localhost:8080/spreadsheet_ts' : '/spreadsheet_ts',
        toolDefn: {
            description: <>A WIP Canvas Spreadsheet/Table Editor Expirement</>,
            summary: <>Looking at how fast the Canvas 2D Drawing is.</>,
        }
    },
    "animation": {
        "label": "2D Animation",
        'url': (isDevVite && pathname !== '/animation') ?
            'http://localhost:8080/animation' : '/animation',
        toolDefn: {
            description: <>A WIP 2D Animation App</>,
            summary: <>Kind of an overzealous adventure to create a simple 2D animation app.
                <br/>So far, I've just use vite to create the app framework.
                <br/>Not sure where this is going to end up. :-)
            </>,
        }
    },
}

export {menus_wirings, menus_apps};