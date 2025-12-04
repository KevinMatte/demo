<?php

$version = file_get_contents("static/version.txt");

 print(<<<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<h1>Kevin Matte's Playground (v{$version})</h1>

<h2><a href="/playground">Technical Playground</a></h2>
<div style="padding-left: 15px">
    <p>Some basic examples exercising docker and different languages.<br/>
        Click here: </p>
    <p>There is a quick tour on YouTube here: <a href="https://youtu.be/fLLyFpopUcY" target="_blank">Playground Quick Tour</a></p>
</div>

<h2><a href="/animation">WIP: Animation Tool by PHP</a></h2>
<div style="padding-left: 15px">
    <p>This is work in progress.</p>
</div>

</body>
</html>
EOF
);
