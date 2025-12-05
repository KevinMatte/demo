if (typeof __KMIncluded === 'undefined')
    __KMIncluded = {};

function loadScripts(fileList) {
    let file;
    while (file = fileList.shift()) {
        if (!__KMIncluded[file])
            break;
    }
    if (!file)
        return true;

    __KMIncluded[file] = true;

    const elmScript = document.createElement('script');
    elmScript.setAttribute('src', file);
    elmScript.setAttribute('async', 'true');

    elmScript.onload = () => {
        loadScripts(fileList);
    };
    elmScript.onerror = () => {
        console.log(`ERROR: KMincludes.js: loadScripts(): Error loading script: ${file}`)
    };

    document.head.appendChild(elmScript);
    return false;
}

__KMIncludes = [
    '/spreadsheet_ts/js/spreadsheet/KMListener.js',
    '/spreadsheet_ts/js/spreadsheet/KMParts.js',
    '/spreadsheet_ts/js/spreadsheet/KMCell.js',
    '/spreadsheet_ts/js/spreadsheet/KMScrollbar.js',
    '/spreadsheet_ts/js/spreadsheet/KMDataSource.js',
    '/spreadsheet_ts/js/spreadsheet/KMCellManager.js',
    '/spreadsheet_ts/js/spreadsheet/KMSpreadsheet.js',
];
if (typeof KMincludeList === 'undefined')
    KMincludeList = [];
KMincludeList = __KMIncludes.concat(KMincludeList);

// Add event listener to the button to trigger script loading on click
loadScripts(KMincludeList);

if (!loadScripts([

    ]))
    exit;

