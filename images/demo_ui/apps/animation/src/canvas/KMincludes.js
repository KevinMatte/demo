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
    'js/spreadsheet/KMListener.js',
    'js/spreadsheet/KMParts.js',
    'js/spreadsheet/KMCell.js',
    'js/spreadsheet/KMScrollbar.js',
    'js/spreadsheet/KMDataSource.js',
    'js/spreadsheet/KMCellManager.js',
    'js/spreadsheet/KMSpreadsheet.js',
];
if (typeof KMincludeList === 'undefined')
    KMincludeList = [];
KMincludeList = __KMIncludes.concat(KMincludeList);

// Add event listener to the button to trigger script loading on click
loadScripts(KMincludeList);

if (!loadScripts([

    ]))
    exit;

