
function testSpreadsheet() {

    let test_elm = null;
    let dataSource = new DataSource(100, 200)

    window.addEventListener("load", () => {
        test_elm = new KMSpreadsheet("spreadsheet", dataSource);
    });
}

testSpreadsheet()