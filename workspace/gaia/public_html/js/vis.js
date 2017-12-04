/* global d3 */
var value = 0;
var headerNames = [];

d3.csv("./data/GaiaSource_1.csv", function (csv_data) {
    csv_data.forEach(
            function (d) {
                headerNames = d3.keys(csv_data[0]);
                value += 1;
                d.value = value;
            });

    var xAxis = document.getElementById("xAxisValue");
    var yAxis = document.getElementById("yAxisValue");
    for (var i = 0; i < headerNames.length; i++) {
        var xAxisOption = document.createElement("option");
        var yAxisOption = document.createElement("option");
        xAxisOption.text = headerNames[i];
        yAxisOption.text = headerNames[i];
        xAxis.add(xAxisOption);
        yAxis.add(yAxisOption);
    }

    var datasetname = document.getElementById("datasetname");
    var rows = document.getElementById("rowCount");
    var columns = document.getElementById("columnCount");
    rows.innerText = value;
    columns.innerText = headerNames.length;
    datasetname.innerText = "Gaia Source";
});

function submitForm() {
    var plotType = document.getElementById("plotType").value;
    var xAxis = document.getElementById("xAxisValue");
    var xAxisValue = xAxis.options[xAxis.selectedIndex].text;
    var yAxis = document.getElementById("yAxisValue");
    var yAxisValue = yAxis.options[yAxis.selectedIndex].text;
}