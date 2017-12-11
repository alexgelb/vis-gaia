//import * as d3 from 'd3'
//import {Renderer, PCA} from '/src'
//const pcaClass = require('./pca')


/* global d3 */
var value = 0;
var headerNames = [];
var csv_data;


d3.csv("./data/GaiaSource_1.csv",
    function (csv_data) {
        var traits = d3.keys(csv_data[0]).filter(
            function (d) {
                return d !== "astrometric_primary_flag" &&
                    d !== "duplicated_source" &&
                    d !== "phot_variable_flag";
            })
        this.csv_data = csv_data;
        // for(var i = 0; i < csv_data.length; i++ ) {
        // delete csv_data[i]["astrometric_primary_flag"];
        // delete csv_data[i]["duplicated_source"];
        // delete csv_data[i]["phot_variable_flag"];
        // }
        var fileData = csv_data;
        for (var i = 0; i < fileData.length; i++) {
            delete fileData[i]["astrometric_primary_flag"];
            delete fileData[i]["duplicated_source"];
            delete fileData[i]["phot_variable_flag"];
            for (var j = 0; j < traits.length; j++) {
                var key = traits[j];
                var tmp = parseFloat(fileData[i][key]);

                if (tmp === undefined || isNaN(tmp) || tmp < -900) {
                    fileData[i][key] = 0;
                } else {
                    fileData[i][key] = tmp;
                }

            }
        }

        headerNames = traits;
        value = csv_data.length;
        var xAxis = document.getElementById("xAxisValue");
        var yAxis = document.getElementById("yAxisValue");
        //var headerValue = document.getElementById("headerValues");
        var multipleValue = document.getElementById("MultipleData");


        for (var i = 0; i < headerNames.length; i++) {
            var xAxisOption = document.createElement("option");
            var yAxisOption = document.createElement("option");
            //var headerValueBox = document.createElement("input");
            var multipleOption = document.createElement("option");
            //var headerValueElement = document.createElement("div");
            xAxisOption.text = headerNames[i];
            yAxisOption.text = headerNames[i];
            multipleOption.text = headerNames[i];
            multipleOption.id = headerNames[i];
            /*headerValueBox.type = "checkbox";
                headerValueBox.disabled= true;
				headerValueBox.name = "boxes";
				headerValueBox.onclick = checkboxLimit();
				headerValueBox.id = headerNames[i];
				headerValue.appendChild(headerValueBox);
				headerValueElement.appendChild(document
						.createTextNode(headerNames[i]));
				headerValue.appendChild(headerValueElement);*/

            xAxis.add(xAxisOption);
            yAxis.add(yAxisOption);
            multipleValue.add(multipleOption);

        }

        var datasetname = document.getElementById("datasetname");
        var rows = document.getElementById("rowCount");
        var columns = document.getElementById("columnCount");
        rows.innerText = value;
        columns.innerText = headerNames.length;
        datasetname.innerText = "Gaia Source";
    });

function submitForm() {
    // var plotType = document.getElementById("plotType").value;
    var xAxis = document.getElementById("xAxisValue");
    var xAxisValue = xAxis.options[xAxis.selectedIndex].text;
    var yAxis = document.getElementById("yAxisValue");
    var yAxisValue = yAxis.options[yAxis.selectedIndex].text;
    var binSize;


    if (document.getElementById("scatterplotType").checked) {
        drawScatterplot(xAxisValue, yAxisValue);
    } else if (document.getElementById("scattermatrixType").checked) {
        //var dataMultiple = document.getElementById("MultipleData");
        //var MultipleDataValue = xAxis.options[dataMultiple.selectedIndex].text;
        correlation(getMultipleData());

        // TODO: drawScattermatrix(getMultipleData());

    } else if (document.getElementById("histogramType").checked) {
        if (document.getElementById("binCheck").checked) {
            binSize = document.getElementById("BinSize").value;
        }
        else {
            binSize = 0;
        }
        drawHistogram(xAxisValue, binSize);


    } else if (document.getElementById("correlogramType").checked) {
        //var dataMultiple = document.getElementById("MultipleData");
        //var MultipleDataValue = xAxis.options[dataMultiple.selectedIndex].text;

        // TODO Nicole: drawCorrelogram(correlation(getMultipleData()));
        console.log(getMultipleData());
        drawCorrelogram(correlation(getMultipleData()));
    } else if (document.getElementById("pcaType").checked) {
        drawPCA();
    } else {
        consolge.log("NONE")
    }
}


function deleteAll() {
    d3.select("svg").remove();
}

function drawCorrelogram(data) {

// data Beispiel
// TODO Nicole: anstatt bespiel, array von objects mit correlations von multiple data
    //console.log(data);
    /*var data = [
        {x: "val1", y: "val1", value: 1},
        {x: "val1", y: "val2", value: -0.852161959426613},
        {x: "val1", y: "val3", value: -0.847551379262479},
        {x: "val1", y: "val4", value: -0.776168371826586},
        {x: "val1", y: "val5", value: 0.681171907806749},
        {x: "val1", y: "val6", value: -0.867659376517228},
        {x: "val1", y: "val7", value: 0.418684033921778},
        {x: "val1", y: "val8", value: 0.664038919127593},
        {x: "val1", y: "val9", value: 0.599832429454648},
        {x: "val1", y: "val10", value: 0.480284757338842},
        {x: "val2", y: "val1", value: -0.852161959426613},
        {x: "val2", y: "val2", value: 1},
        {x: "val2", y: "val3", value: 0.902032872146999},
        {x: "val2", y: "val4", value: 0.83244745272182},
        {x: "val2", y: "val5", value: -0.69993811382877},
        {x: "val2", y: "val6", value: 0.782495794463241},
        {x: "val2", y: "val7", value: -0.591242073768869},
        {x: "val2", y: "val8", value: -0.810811796083005},
        {x: "val2", y: "val9", value: -0.522607046900675},
        {x: "val2", y: "val10", value: -0.492686599389471},
        {x: "val3", y: "val1", value: -0.847551379262479},
        {x: "val3", y: "val2", value: 0.902032872146999},
        {x: "val3", y: "val3", value: 1},
        {x: "val3", y: "val4", value: 0.790948586369806},
        {x: "val3", y: "val5", value: -0.71021392716927},
        {x: "val3", y: "val6", value: 0.887979922058138},
        {x: "val3", y: "val7", value: -0.433697880811014},
        {x: "val3", y: "val8", value: -0.7104158907906},
        {x: "val3", y: "val9", value: -0.591227040063948},
        {x: "val3", y: "val10", value: -0.555569198562483},
        {x: "val4", y: "val1", value: -0.776168371826586},
        {x: "val4", y: "val2", value: 0.83244745272182},
        {x: "val4", y: "val3", value: 0.790948586369806},
        {x: "val4", y: "val4", value: 1},
        {x: "val4", y: "val5", value: -0.44875911687292},
        {x: "val4", y: "val6", value: 0.658747887344759},
        {x: "val4", y: "val7", value: -0.708223388861953},
        {x: "val4", y: "val8", value: -0.72309673735245},
        {x: "val4", y: "val9", value: -0.243204257185851},
        {x: "val4", y: "val10", value: -0.125704258225474},
        {x: "val5", y: "val1", value: 0.681171907806749},
        {x: "val5", y: "val2", value: -0.69993811382877},
        {x: "val5", y: "val3", value: -0.71021392716927},
        {x: "val5", y: "val4", value: -0.44875911687292},
        {x: "val5", y: "val5", value: 1},
        {x: "val5", y: "val6", value: -0.712440646697372},
        {x: "val5", y: "val7", value: 0.091204759651183},
        {x: "val5", y: "val8", value: 0.440278464955349},
        {x: "val5", y: "val9", value: 0.71271112722627},
        {x: "val5", y: "val10", value: 0.699610131934665},
        {x: "val6", y: "val1", value: -0.867659376517228},
        {x: "val6", y: "val2", value: 0.782495794463241},
        {x: "val6", y: "val3", value: 0.887979922058138},
        {x: "val6", y: "val4", value: 0.658747887344759},
        {x: "val6", y: "val5", value: -0.712440646697372},
        {x: "val6", y: "val6", value: 1},
        {x: "val6", y: "val7", value: -0.174715878713405},
        {x: "val6", y: "val8", value: -0.554915677663994},
        {x: "val6", y: "val9", value: -0.692495258839484},
        {x: "val6", y: "val10", value: -0.583286996536648},
        {x: "val7", y: "val1", value: 0.418684033921778},
        {x: "val7", y: "val2", value: -0.591242073768869},
        {x: "val7", y: "val3", value: -0.433697880811014},
        {x: "val7", y: "val4", value: -0.708223388861953},
        {x: "val7", y: "val5", value: 0.091204759651183},
        {x: "val7", y: "val6", value: -0.174715878713405},
        {x: "val7", y: "val7", value: 1},
        {x: "val7", y: "val8", value: 0.744535443526254},
        {x: "val7", y: "val9", value: -0.229860862184883},
        {x: "val7", y: "val10", value: -0.212682229720365},
        {x: "val8", y: "val1", value: 0.664038919127593},
        {x: "val8", y: "val2", value: -0.810811796083005},
        {x: "val8", y: "val3", value: -0.7104158907906},
        {x: "val8", y: "val4", value: -0.72309673735245},
        {x: "val8", y: "val5", value: 0.440278464955349},
        {x: "val8", y: "val6", value: -0.554915677663994},
        {x: "val8", y: "val7", value: 0.744535443526254},
        {x: "val8", y: "val8", value: 1},
        {x: "val8", y: "val9", value: 0.168345124585359},
        {x: "val8", y: "val10", value: 0.206023348733579},
        {x: "val9", y: "val1", value: 0.599832429454648},
        {x: "val9", y: "val2", value: -0.522607046900675},
        {x: "val9", y: "val3", value: -0.591227040063948},
        {x: "val9", y: "val4", value: -0.243204257185851},
        {x: "val9", y: "val5", value: 0.71271112722627},
        {x: "val9", y: "val6", value: -0.692495258839484},
        {x: "val9", y: "val7", value: -0.229860862184883},
        {x: "val9", y: "val8", value: 0.168345124585359},
        {x: "val9", y: "val9", value: 1},
        {x: "val9", y: "val10", value: 0.794058760256343},
        {x: "val10", y: "val1", value: 0.480284757338842},
        {x: "val10", y: "val2", value: -0.492686599389471},
        {x: "val10", y: "val3", value: -0.555569198562483},
        {x: "val10", y: "val4", value: -0.125704258225474},
        {x: "val10", y: "val5", value: 0.699610131934665},
        {x: "val10", y: "val6", value: -0.583286996536648},
        {x: "val10", y: "val7", value: -0.212682229720365},
        {x: "val10", y: "val8", value: 0.206023348733579},
        {x: "val10", y: "val9", value: 0.794058760256343},
        {x: "val10", y: "val10", value: 1}
    ];*/
 var data = [{ x: "pmra", y: "pmra", value: 1 },
{ x: "pmra", y: "pmra_error", value: -0.12330284733382797 },
{ x: "pmra", y: "pmdec", value: 0.01882460365078317 },
{ x: "pmra", y: "pmdec_error", value: -0.11668777466257425 },
{ x: "pmra_error", y: "pmra", value: -0.12330284733382797 },
{ x: "pmra_error", y: "pmra_error", value: 1 },
{ x: "pmra_error", y: "pmdec", value: 0.10047853529158035 },
{ x: "pmra_error", y: "pmdec_error", value: 0.8239659961934964 },
{ x: "pmdec", y: "pmra", value: 0.01882460365078317 },
{ x: "pmdec", y: "pmra_error", value: -0.11668777466257425 },
{ x: "pmdec", y: "pmdec", value: 1 },
{ x: "pmdec", y: "pmdec_error", value: 0.04208788770905131 },
{ x: "pmdec_error", y: "pmra", value: 0.8239659961934964 },
{ x: "pmdec_error", y: "pmra_error", value: -0.11668777466257425 },
{ x: "pmdec_error", y: "pmdec", value: 0.04208788770905131 },
{ x: "pmdec_error", y: "pmdec_error", value: 1 }];

    var margin = {
            top: 45,
            right: 80,
            bottom: 25,
            left: 40
        },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        domain = d3.set(data.map(function (d) {
            return d.x
        })).values(),
        num = Math.sqrt(data.length),
        color = d3.scale.linear()
            .domain([-1, 0, 1])
            .range(["#361CA0", "#F0D1D1", "#852934"]);


    var x = d3.scale
            .ordinal()
            .rangePoints([0, width])
            .domain(domain),
        y = d3.scale
            .ordinal()
            .rangePoints([0, height])
            .domain(domain),
        xSpace = x.range()[1] - x.range()[0],
        ySpace = y.range()[1] - y.range()[0];

    var svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("font", "12px", "sans-serif")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var cor = svg.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function (d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

    cor.append("rect")
        .attr("id", "corr_rect")
        .attr("stroke", "gray")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("width", xSpace)
        .attr("height", ySpace)
        .attr("x", -xSpace / 2)
        .attr("y", -ySpace / 2)

    cor.filter(function (d) {
        var ypos = domain.indexOf(d.y);
        var xpos = domain.indexOf(d.x);
        for (var i = (ypos + 1); i < num; i++) {
            if (i === xpos) return false;
        }
        return true;
    })
        .append("text")
        .attr("y", 5)
        .text(function (d) {
            if (d.x === d.y) {
                return d.x;
            } else {
                return d.value.toFixed(2);
            }
        })
        .style("fill", function (d) {
            if (d.value === 1) {
                return "#000";
            } else {
                return color(d.value);
            }
        });

    cor.filter(function (d) {
        var ypos = domain.indexOf(d.y);
        var xpos = domain.indexOf(d.x);
        for (var i = (ypos + 1); i < num; i++) {
            if (i === xpos) return true;
        }
        return false;
    })
        .append("circle")
        .attr("r", function (d) {
            return (width / (num * 2)) * (Math.abs(d.value) + 0.15);
        })
        .style("fill", function (d) {
            if (d.value === 1) {
                return "#000";
            } else {
                return color(d.value);
            }
        });

    var aS = d3.scale
        .linear()
        .range([-margin.top + 9, height + margin.bottom - 5])
        .domain([1, -1]);

    var yA = d3.svg.axis()
        .orient("right")
        .scale(aS)
        .tickPadding(7);

    var aG = svg.append("g")
        .attr("class", "y axis")
        .call(yA)
        .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)")

    var iR = d3.range(-1, 1.01, 0.01);
    var h = height / iR.length + 3;
    iR.forEach(function (d) {
        aG.append('rect')
            .style('fill', color(d))
            .style('stroke-width', 0)
            .style('stoke', 'none')
            .attr('height', h)
            .attr('width', 10)
            .attr('x', 0)
            .attr('y', aS(d))
    });
}

function drawHistogram(xAxisValue, binSize) {
    
    
    var bin = 0;
    var color = "grey";
    var f_dataset = csv_data.map(function (d) {
        return d[xAxisValue];
    });
/* var f_dataset = dataset.filter(function (d) {
               
                return d <-900;
                                });
     var f_dataset = csv_data.filter(function (d) {
        return xAxisValue.reduce(function (acc, column) {
            return acc && +d[column] && +d[column] != -999 && !isNaN(+d[column]);
        }, true);
    });*/
    
    var margin = {
            top: 50,
            right: 20,
            bottom: 110,
            left: 60
        },
        margin2 = {
            top: 230,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 660 - margin.left - margin.right,
        height = 300 - margin.top -
            margin.bottom,
        height2 = 300 - margin2.top - margin2.bottom;

    var max = d3.max(f_dataset);
    var min = d3.min(f_dataset);

    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);


    if (binSize == 0) {
        bin = Math.log2(f_dataset.length) + 1;
    }
    else {
        bin = binSize;
    }

    var data = d3.layout.histogram()
        .bins(x.ticks(bin))
        (f_dataset);

    var yMax = d3.max(data, function (d) {
        return d.length
    });
    var yMin = d3.min(data, function (d) {
        return d.length
    });

    var colorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + xAxisValue + ": </strong> <span style='color:white'>" + d3.format(",.0f")(d.y) + "</span>";
        });

    var svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    if (typeof(data[0]) == "undefined") {
        alert("Change your bin size please!");
        deleteAll();
        return;
    }
    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function (d) {
            return height - y(d.y);
        })
        .attr("fill", function (d) {
            return colorScale(d.y)
        })
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "#2e2e30");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", function (d) {
                return colorScale(d.y);
            })
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".80em");

}

function drawScatterplot(xAxisValue, yAxisValue) {
    var margin = {
            top: 20,
            right: 20,
            bottom: 110,
            left: 60
        },
        margin2 = {
            top: 230,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 660 - margin.left - margin.right,
        height = 300 - margin.top -
            margin.bottom,
        height2 = 300 - margin2.top - margin2.bottom;
    var x1 = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range(
            [0, width]),
        y1 = d3.scale.linear().range([height, 0]),
        y2 = d3
            .scale.linear().range([height2, 0]);
    var xAxis1 = d3.svg.axis().scale(x1).orient("left"),
        xAxis2 = d3.svg.axis().scale(x2).orient("left"),
        yAxis1 = d3.svg.axis().scale(y1).orient("left")
    var scatterSVG = d3.select("#plot").append("svg").attr("height",
        (height + margin.top + margin.bottom + 10));
    scatterSVG.append("defs").append("clipPath").attr("id", "clip").append(
        "rect").attr("width", width).attr("height", height);
    var focusView = scatterSVG.append("g").attr("class", "focusView").attr(
        "transform", "translate(" + margin.left + "," + margin.top + ")");
    var brush = d3.svg.brush().extent([
        [0, 0],
        [width, height2]
    ]).on("brush",
        brushed);
    var contextView = scatterSVG.append("g").attr("class", "contextView").attr(
        "transform", "translate(" + margin.left + "," + margin2.top + ")");

    var xText = "X-Values";
    var yText = "Y-Values";

    x1.domain(d3.extent(csv_data, function (d) {
        return d[xAxisValue];
    }));
    y1.domain([0, d3.max(csv_data, function (d) {
        return d[yAxisValue];
    })]);
    x2.domain(x1.domain());
    y2.domain(y1.domain());

    var dots = focusView.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot").data(csv_data).enter()
    // .filter(function (d) {
    // return (d.distance !== undefined) && !isNaN(y1(d.distance));
    // })
        .append("circle").attr('class', 'dot').attr("r", 2).style("opacity", .5)
        .attr("cx", function (d) {
            return x1(d[xAxisValue]);
        }).attr("cy", function (d) {
        return y1(d[yAxisValue]);
    }).on("click", function () {
        d3.select(this).attr("class", "dot clicked");
    });
    focusView.append("g").attr("class", "axis x-axis").attr("transform",
        "translate(0," + height + ")").call(xAxis1);
    focusView.append("g").attr("class", "axis y-axis").call(yAxis1);
    focusView.append("text").attr("transform", "rotate(-90)").attr("y",
        0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em")
        .style("text-anchor", "middle").text(xAxisValue);
    scatterSVG.append("text").attr(
        "transform",
        "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
        (height + margin.top + margin.bottom + 10) + ")").style(
        "text-anchor", "middle").text(yAxisValue);
    var dots = contextView.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot").data(csv_data).enter()
    // .filter(function (d) {
    // return (d.distance !== undefined) && !isNaN(y2(d.distance));
    // })
        .append("circle").attr('class', 'dotcontextView').attr("r", 1).style(
        "opacity", .5).attr("cx", function (d) {
        return x2(d[xAxisValue]);
    }).attr("cy", function (d) {
        return y2(d[yAxisValue]);
    });
    contextView.append("g").attr("class", "axis x-axis").attr("transform",
        "translate(0," + height2 + ")").call(xAxis2);
    contextView.append("g").attr("class", "brush").call(brush).call(brush.move,
        x1.range());

    function brushed() {
        var selection = d3.event.selection;
        x1.domain(selection.map(x2.invert, x2));
        focusView.selectAll(".dot").attr("cx", function (d) {
            return x1(d[xAxisValue]);
        }).attr("cy", function (d) {
            return y1(d[yAxisValue]);
        });
        focusView.select(".x-axis").call(xAxis1);
    }
}


/*function drawPCA() {
	d3.csv('GaiaSource_1.csv')
	// d3.csv('data.csv')
	.row((d) => {
	   const obj = {
	      name: d.source_id,
	// name: d.name,
			   values: {}
	    }
	    for (const key in d) {
	      if (key !== 'solution_id' && key !== 'source_id' && key !== 'random_index' && key !== 'random_index' && key !== 'ref_epoch' && key !== 'astrometric_primary_flag' && key !== 'duplicated_source' && key !== 'phot_variable_flag') {
	// if(key !== 'name' ) {
	// obj.values[key] = +d[key]
	    	var tmp = parseFloat(d[key]);
	    	if (isNaN(tmp)) {
	    		obj.values[key] = 0;
	    	} else {
	    		obj.values[key] = tmp;
	    	}
	    	
	      }
	    }
	//   console.log(obj);
	    return obj
	  })
	  .get((errors, data) => {
	    const p = 0.999999999999
	    const pca = new PCA(data)
	    const lambda = pca.lambda()
	    const sumLambda = lambda.reduce((a, x) => a + x)
	    const renderer = new Renderer().size([400, 400])

	    let i
	    let acc = 0
	    for (i = 0; i < lambda.length; ++i) {
	      acc += lambda[i]
	      if (acc > (sumLambda * p)) {
	        break
	      }
	      
	    }
	    const n = i + 1;
	    console.log("n: " + n)
	    for (let i = 0; i < n; ++i) {
	      for (let j = i + 1; j < n; ++j) {
	        d3.select('body')
	          .append('svg')
	          .datum(pca.get(i, j))
	          .call(renderer.render())
//	    	  console.log(pca.get(i,j))
	      }
	    }
	  })

}*/

function getMultipleData() {
    var MultipleData = headerNames.filter(function (d) {
        if (document.getElementById(d).selected)
            return d;

    });
    /*if (MultipleData.length > 5) {
        alert("You can select only 5 values!");
        MultipleData = 0;
    }*/
    //console.log(MultipleData);
    return MultipleData
}

/*
function getMultipleData() {
	MultipleData = headerNames.filter(function(d) {
		if (document.getElementById(d).checked)
			return d
	});
}

function checkboxLimit() {

	for (var j = 0; j < document.getElementsByName("boxes").length; j++) {
		document.getElementsByName("boxes")[j].onclick = function() {
			var count = 0;
			for (var i = 0; i < document.getElementsByName("boxes").length; i++) {
				count += (document.getElementsByName("boxes")[i].checked) ? 1
						: 0
			}
			if (count > 5) {
				alert("You can select only 5 values!");
				this.checked = false;
			}
		}
	}
}
*/

function correlation(MultipleData) {
    var correlations = [];

    var filtered_data = csv_data.filter(function (d) {
        return MultipleData.reduce(function (acc, column) {
            return acc && +d[column] && +d[column] != -999 && !isNaN(+d[column]);
        }, true);
    });

    for (var i = 0; i < MultipleData.length - 1; i++) {
        for (var j = i + 1; j < MultipleData.length; j++) {
            var col1 = filtered_data.map(function (d) {
                return +d[MultipleData[i]]
            });

            var col2 = filtered_data.map(function (d) {
                return +d[MultipleData[j]]
            });

            var avg_col1 = d3.sum(col1, function (d) {
                return d
            }) / col1.length;

            var avg_col2 = d3.sum(col2, function (d) {
                return d
            }) / col2.length;

            var coeff = d3.sum(col1.map(function (d, i) {
                return (d - avg_col1) * (col2[i] - avg_col2)
            }), function (d) {
                return d
            }) / Math.sqrt(
                d3.sum(col1.map(function (d) {
                    return Math.pow((d - avg_col1), 2)
                }), function (d) {
                    return d
                }) * d3.sum(col2.map(function (d) {
                    return Math.pow((d - avg_col2), 2)
                }), function (d) {
                    return d
                })
            );
            var corrValue = {x: MultipleData[i], y: MultipleData[j], value: coeff};
            //console.log(MultipleData[i] + " | " + MultipleData[j] + ": Koeffizient = " + coeff + "\n")
            correlations.push(corrValue);
        }
    }
    console.log("aaaaaa");
    console.log(correlations);
    return correlations;
}


function histogramActive() {

    /*  if (document.getElementById("scattermatrixType").checked)
   {
       for (var i = 0; i < document.getElementsByName("boxes").length; i++) {
                document.getElementsByName("boxes")[i].disabled = false;
            }

    }
    else
   {
      for (var i = 0; i < document.getElementsByName("boxes").length; i++) {
                document.getElementsByName("boxes")[i].disabled = true;
            }
   }*/

    if (document.getElementById("scatterplotType").checked) {
        document.getElementById("xAxisValue").disabled = false;
        document.getElementById("yAxisValue").disabled = false;
    } else if (document.getElementById("histogramType").checked) {
        document.getElementById("xAxisValue").disabled = false;
        document.getElementById("yAxisValue").disabled = true;
        //document.getElementById("BinSize").disabled = false;
        document.getElementById("binCheck").disabled = false;
    } else {
        document.getElementById("xAxisValue").disabled = true;
        document.getElementById("yAxisValue").disabled = true;
        document.getElementById("binCheck").disabled = true;
        document.getElementById("BinSize").disabled = true;
    }

    if (document.getElementById("scattermatrixType").checked || document.getElementById("correlogramType").checked) {
        document.getElementById("MultipleData").disabled = false;

    } else {
        document.getElementById("MultipleData").disabled = true;

    }
}

function binCheckFunction() {
    if (document.getElementById("binCheck").checked) {
        document.getElementById("BinSize").disabled = false;
    }
    else {
        document.getElementById("BinSize").disabled = true;

    }
}