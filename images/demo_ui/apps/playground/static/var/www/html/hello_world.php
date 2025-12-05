<?php

function main()
{
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
    header("Pragma: no-cache");

    # Get 'head_content.txt' which contains a standard content for the demo_ui's HTML <head>.
    $templateDir = "{$_SERVER["DOCUMENT_ROOT"]}/public/templates";
    try {
        $headContentPath = "$templateDir/head_content.txt";
        $headContent = file_get_contents($headContentPath);
    } catch (Exception $ex) {
        $headContent = '';
    }

    print(<<<EOF
<!DOCTYPE html>
<html lang="en">
<head>$headContent</head>

<body>
<div style="padding: 25px">
    Hello World: PHP Script
</div>
</body>

</html>

EOF
    );
}

main();
