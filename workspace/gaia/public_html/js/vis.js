/* global d3 */
var value = 0;
var headerNames = [];
var csv_data;

d3.csv("./data/GaiaSource_1.csv", function (csv_data) {
    csv_data.forEach(
            function (d) {
                headerNames = d3.keys(csv_data[0]);
                value += 1;
                d.value = value;
            });
            
    this.csv_data = csv_data;

    var xAxis = document.getElementById("xAxisValue");
    var yAxis = document.getElementById("yAxisValue");
    var headerValue = document.getElementById("headerValues");
   
    for (var i = 0; i < headerNames.length; i++) {
        var xAxisOption = document.createElement("option");
        var yAxisOption = document.createElement("option");
        var headerValueElement = document.createElement("div");
        var headerValueBox = document.createElement("input");
        xAxisOption.text = headerNames[i];
        yAxisOption.text = headerNames[i];
        headerValueElement.appendChild(document.createTextNode(headerNames[i]));
        //headerValueBox.appendChild(document.createAttribute("type").value = "checkbox");
        
        //document.getElementById("headerValues").appendChild(headerValueBox);
        headerValue.appendChild(headerValueElement);
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
    
    var Axis = document.getElementById("AxisValue");
    var AxisValue = Axis.options[Axis.selectedIndex].text;
    
    if (plotType.indexOf('scatterplot') > -1) {
        drawScatterplot(xAxisValue, yAxisValue);
    }
}


function drawScatterplot(xAxisValue, yAxisValue) {
    var margin = {top: 20, right: 20, bottom: 110, left: 60},
            margin2 = {top: 230, right: 20, bottom: 30, left: 40},
            width = 660 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom,
            height2 = 300 - margin2.top - margin2.bottom;
    var x1 = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y1 = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);
    var xAxis1 = d3.axisBottom(x1),
            xAxis2 = d3.axisBottom(x2),
            yAxis1 = d3.axisLeft(y1);
    var scatterSVG = d3.select("#plot").append("svg").attr("height", (height + margin.top + margin.bottom + 10));
    scatterSVG.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
    var focusView = scatterSVG.append("g")
            .attr("class", "focusView")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("end", brushed);
    var contextView = scatterSVG.append("g")
            .attr("class", "contextView")
            .attr("transform", "translate(" + margin.left + "," + margin2.top + ")");
    
    var xText = "X-Values";
    var yText = "Y-Values";
    
    x1.domain(d3.extent(csv_data, function (d) {
        return d[xAxisValue];
    }));
    y1.domain([0, d3.max(csv_data, function (d) {
            return d[yAxisValue];
        })
    ]);
    x2.domain(x1.domain());
    y2.domain(y1.domain());
    var dots = focusView.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot")
            .data(csv_data)
            .enter()
//            .filter(function (d) {
//                return (d.distance !== undefined) && !isNaN(y1(d.distance));
//            })
            .append("circle")
            .attr('class', 'dot')
            .attr("r", 2)
            .style("opacity", .5)
            .attr("cx", function (d) {
                return x1(d[xAxisValue]);
            })
            .attr("cy", function (d) {
                return y1(d[yAxisValue]);
            })
            .on("click", function () {
                d3.select(this).attr("class", "dot clicked");
            });
    focusView.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis1);
    focusView.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis1);
    focusView.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(xAxisValue);
    scatterSVG.append("text")
            .attr("transform",
                    "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                    (height + margin.top + margin.bottom + 10) + ")")
            .style("text-anchor", "middle")
            .text(yAxisValue);
    var dots = contextView.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot")
            .data(csv_data)
            .enter()
//            .filter(function (d) {
//                return (d.distance !== undefined) && !isNaN(y2(d.distance));
//            })
            .append("circle")
            .attr('class', 'dotcontextView')
            .attr("r", 1)
            .style("opacity", .5)
            .attr("cx", function (d) {
                return x2(d[xAxisValue]);
            })
            .attr("cy", function (d) {
                return y2(d[yAxisValue]);
            });
    contextView.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);
    contextView.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x1.range());
    function brushed() {
        var selection = d3.event.selection;
        x1.domain(selection.map(x2.invert, x2));
        focusView.selectAll(".dot")
                .attr("cx", function (d) {
                    return x1(d[xAxisValue]);
                })
                .attr("cy", function (d) {
                    return y1(d[yAxisValue]);
                });
        focusView.select(".x-axis").call(xAxis1);
    }
}