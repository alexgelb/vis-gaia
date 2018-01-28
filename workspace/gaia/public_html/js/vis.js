/* global d3, d4 */

var value = 0;
var headerNames = [];
var csv_data;
var regressions = [];

//d3.csv("./data/GaiaSource_1.csv",
d3.csv("./data/GaiaSource_1_5k.csv",
        function (csv_data) {
            var traits = d3.keys(csv_data[0]).filter(
                    function (d) {
                        return d !== "astrometric_primary_flag" &&
                                d !== "duplicated_source" &&
                                d !== "phot_variable_flag" &&
                            d !== "solution_id" &&
                            d !== "source_id" &&
                            d !== "ref_epoch" &&
                            d !== "random_index" ;
                    })
            this.csv_data = csv_data;

            var fileData = csv_data;
            for (var i = 0; i < fileData.length; i++) {
                delete fileData[i]["astrometric_primary_flag"];
                delete fileData[i]["duplicated_source"];
                delete fileData[i]["phot_variable_flag"];
                for (var j = 0; j < traits.length; j++) {
                    var key = traits[j];
                    var tmp = parseFloat(fileData[i][key]);

                    if (tmp === undefined || isNaN(tmp) || tmp < -900) {
                        //                    fileData[i][key] = 0;
                    } else {
                        fileData[i][key] = tmp;
                    }

                }
            }

            headerNames = traits;
            value = csv_data.length;

            var multipleValue = document.getElementById("MultipleData");

            for (var i = 0; i < headerNames.length; i++) {

                var multipleOption = document.createElement("option");

                multipleOption.text = headerNames[i];
                multipleOption.id = headerNames[i];


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
d3.selectAll("svg").remove();
   // console.time('drawScatterPlotMatrix');
    if (getMultipleData() != 0) {
        drawScatterPlotMatrix(getMultipleData());
    } else {
        alert("Please select any data values!");
    }

    //console.timeEnd('drawScatterPlotMatrix');
}

/*function deleteAll() {
    if (d3.select("svg") == 0) {
        alert("Nothing to delete!");
    }
    d3.selectAll("svg").remove();
    headerNames.filter(function (d) {
        document.getElementById(d).selected = false;
    })
}
*/
function drawScatterPlotMatrix(chosenValues) {

    var correlations = correlation(chosenValues);

    var size = 230,
            padding = 50;

    var x = d4.scaleLinear()
            .range([padding / 2, size - padding / 2]);

    var y = d4.scaleLinear()
            .range([size - padding / 2, padding / 2]);

    var xAxis = d4.axisBottom().ticks(4).tickFormat(d3.format(",.2f"))
            .scale(x);
    var yAxis = d4.axisLeft().ticks(4).tickFormat(d3.format(",.2f"))
            .scale(y);

    var color = d4.scaleOrdinal(d4.schemeCategory10);

    var domainByTrait = {},
            traits = chosenValues,
            n = traits.length;

    traits.forEach(function (trait) {
        domainByTrait[trait] = d4.extent(csv_data, function (d) {
            var tmp = parseFloat(d[trait]);
            if (!isNaN(tmp) && tmp > -900) {
                return tmp;
            }
//            return +d[trait];
        });
    });

    xAxis.tickSize(size * n - 23);

    var brush = d4.brush()
            .on("start", brushstart)
            .on("brush", brushmove)
            .on("end", brushend)
            .extent([[0, 0], [size, size]]);

    var svg = d4.select("#plot").append("svg")
            .attr("width", size * n + (padding + 100))
            .attr("height", size * n + (padding + 100))
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
            .data(traits)
            .enter()
            .append("g")

            .attr("class", "x axis")
            .attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * size + ",25)";
            })
            .each(function (d) {
                x.domain(domainByTrait[d]);
                d4.select(this).call(xAxis);
            });
    var g = 0;
    var k = chosenValues.length - 1;

    svg.selectAll(".y.axis")
            .data(traits)
            .enter()
            .append("g")
            .attr("class", "y axis")

            .attr("transform", function (d, i) {
                return "translate(5," + i * size + ")";
            })

            .each(function (d) {
                g++;
                if (g != svg.selectAll(".y.axis")._groups[0].length) {
                    yAxis.tickSize(-(k) * 230 + 20 + 10);
                    k--;
                    y.domain(domainByTrait[d]);

                    d4.select(this).call(yAxis);
                }
            });


    var crossedData = crossData(traits, traits);

    var cell = svg.selectAll(".cell")
            .data(crossedData)
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function (d) {
                return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
            });


    cell.filter(function (d) {
        return d.i !== d.j && d.i > d.j;
    }).each(plot);

    cell.filter(function (d) {
        return d.i === d.j || d.i < d.j;
    }).each(plot_histo);

    cell.filter(function (d) {
        return d.i < d.j;
    }).selectAll("rect").style("fill", "#ffffff");


    cell.filter(function (d) {
        return d.i === d.j;
    }).append("text")
            .attr("x", padding - 10)
            .attr("y", padding - 10)
            .attr("dy", ".71em")
            .text(function (d) {
                return d.x;
            });

     cell.filter(function (d) {
        return d.i < d.j;
    }).append("text")
            .attr("x", padding - 10)
            .attr("y", padding - 10)
            .attr("dy", ".71em")
            .text(function (d) {
                return "Correlation coefficient";
            });


    cell.filter(function (d) {
        return d.i < d.j;
    })
            .append("text")
            .attr("x", padding - 10)
            .attr("y", padding - 10)
            .attr("dy", "90px")
            .attr("dx", "75px")
            .attr("class", "corrwert")
            .style("opacity", "0.8")
            .style("text-anchor", "middle")
            .text(function (d, i) {
                return correlations[i].toFixed(3);

            })

            .style("font-size", function (d, i) {
                return (((size - padding) / 7) * (Math.abs(correlations[i]) + 0.7)) + "px";
           
            })
     .style("fill", "#08298A");



        var tip = d3.tip()
            .attr('class', 'd3-tip1')
            .offset([-10, 0])
            .html(function (d, i, j) {
                if (isNaN(correlations[i])) {
                    return "<strong> r ( </strong>" + d.x + " , \n" + d.y + "<strong> )</strong> = <strong>" + " - " + "</strong>";
                } else {
                    return "<strong> r ( </strong>" + d.x + " , \n" + d.y + "<strong> )</strong> = <strong>" + correlations[j].toFixed(10) + "</strong>";
                }
                console.log(d.x);
            });
    
    
     svg.call(tip);
    d3.selectAll(".cell").filter(function (d) {
        return d.i < d.j;
    }).selectAll(".corrwert")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


    cell.filter(function (d) {
        return d.i !== d.j && d.i > d.j;
    }).call(brush);


    var histodaten = [];
    for (var j = 0; j < chosenValues.length; j++) {
        var dataset = csv_data.map(function (d) {
            return d[chosenValues[j]];
        });

        var f_dataset = dataset.filter(function (d) {
            return d != -999 && !isNaN(+d)
        });

        histodaten.push(f_dataset);
    }


    for (var i = 0; i < histodaten.length; i++) {
        plot_histo1(histodaten[i], chosenValues[i], d3.select(cell.filter(function (d) {
            return d.i == d.j;
        })._groups[0][i]));
    }


    function plot_histo(p) {
        var cell = d4.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);
    }


    function plot_histo1(f_dataset, valuename, histocell) {
        var parameter = 6;
        var color = "grey";
        var dy_em = ".80em";

        var width = size - padding;
        height = size - padding - 70;

        var x = d3.scale.linear()
                .domain([d3.min(f_dataset), d3.max(f_dataset)])
                .range([0, width]);


        var bin = 4; //Math.pow(f_dataset.length, 1 / 3);

        var dataset = d3.layout.histogram()
                .bins(x.ticks(bin))
                (f_dataset);

        var color2 = d3.scale.linear()
                .domain([d3.min(dataset, function (d) {
                        return d.length;
                    }), d3.max(dataset, function (d) {
                        return d.length;
                    })])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

        var y = d3.scale.linear()
                .domain([0, d3.max(dataset, function (d) {
                        return d.length;
                    })])
                .range([height, 0]);


        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d, i) {
                    return "<strong>y-value : </strong> <span style='color:white'>" + d3.format(",..0f")((d.y)*100/csv_data.length) + "% </span>";
                });

        var svgObject =
                histocell.append("svg")
                .attr("x", padding - 19.5 - 5)
                .attr("y", padding + 30)
                .style("vertical-align", "middle")
                .style("height", "100%")
                .append("g");

        svgObject.call(tip);

        if (typeof (dataset[0]) == "undefined") {
            alert("Change your bin size or X-Axis-Value please!");
            deleteAll();
            return;
        }

        svgObject.selectAll(".bar")
                .data(dataset)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function (d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide).append("rect")
                .attr("x", 1)
                .attr("width", (x(dataset[0].dx) - x(0)) - 1)
                .attr("height", function (d) {
                    return height - y(d.y);
                })
                .attr("fill", function (d) {
                    return color2(d.y)
                })
                .on("mouseover", function () {
                    d3.select(this)
                            .attr("fill", "#08298A");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("fill", function (d) {
                        return color2(d.y);
                    })
                });
    }

    function plot(p) {

        var cell = d4.select(this);
//a=x; b=y;
        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);


        cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

        cell.selectAll("circle")
                .data(csv_data)
                .enter()
                .filter(function (d) {
                    var tmpX = parseFloat(d[p.x]);
                    var tmpY = parseFloat(d[p.y]);
                    return (tmpX !== undefined && tmpY !== undefined) && (!isNaN(tmpX) && !isNaN(tmpY)) && (tmpX > -900 && tmpY > -900);
                })
                .append("circle")
                .attr("cx", function (d) {
                    return x(d[p.x]);
                })
                .attr("cy", function (d) {
                    return y(d[p.y]);
                })
                .attr("r", 2)
                .style("fill-opacity", function(d) { return getOpacity(); });
//                .attr("fill", function (d) {
//                    return color("blue");
//                });
/*
  a.domain(domainByTrait[p.x]).nice(8);
        b.domain(domainByTrait[p.y]).nice(8);
       
        var xAxisData = csv_data.map(function(d) { return d[p.x]; });
        var yAxisData = csv_data.map(function(d) { return d[p.y]; });
        var regression = leastSquaresequation(xAxisData,yAxisData);

        var line = d3.svg.line()
                .x(function (d) {
                    return a(d[p.x]);
                })
                .y(function (d) {
                    return b(regression(d[p.x]));
                });


        cell.append("path")
                .datum(csv_data)
                .attr("class", "line")
                .attr("d", line)
                .on("mousemove", function () {
                    d3.select(".tooltip").style("left", function (d) {
                        return (d3.event.pageX + 10) + "px";
                    }).style("top", function (d) {
                        return (d3.event.pageY - 50) + "px";
                    });
                    d3.select(".tooltip").style("visibility", "visible");
                    reg = parseFloat(regression(x.invert(d4.event.pageX - cell.node().getBoundingClientRect().left - 20))).toFixed(3);
                    d3.select(".tooltip").text("test " + reg);

                })
                .on("mouseout", function () {
                    d3.select(".tooltip").style("visibility", "hidden");

                });

        cell.append("div").attr("class", "tip");
*/
    }

    var brushCell;

    function brushstart(p) {

        if (brushCell !== this) {
            d4.select(brushCell).call(brush.move, null);

            brushCell = this;
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
        }
    }

    function brushmove(p) {
        var e = d4.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function (d) {
            return !e ? false : (e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0] || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]);
        });
    }

    function brushend() {
        var e = d4.brushSelection(this);
        if (e === null)
            svg.selectAll(".hidden").classed("hidden", false);
    }

    function crossData(a, b) {
        var c = [],
                n = a.length,
                m = b.length;

        for (var i = -1; ++i < n; ) {
            for (var j = -1; ++j < m; ) {
                var valueA = a[i];
                var valueB = b[j];

                c.push({
                    x: valueA,
                    i: i,
                    y: valueB,
                    j: j
                });
            }
        }
        return c;
    }
}
/*
function leastSquaresequation(a, b) {
    var ReduceAddition = function (prev, cur) {
        return prev + cur;
    };

    // finding the mean of Xaxis and Yaxis data
    var xBar = a.reduce(ReduceAddition) * 1.0 / a.length;
    var yBar = b.reduce(ReduceAddition) * 1.0 / b.length;

    var SquareXX = a.map(function (d) {
        return Math.pow(d - xBar, 2);
    }).reduce(ReduceAddition);

    var ssYY = b.map(function (d) {
        return Math.pow(d - yBar, 2);
    }).reduce(ReduceAddition);

    var MeanDiffXY = a.map(
            function (d, i) {
                return (d - xBar) * (b[i] - yBar);
            }).reduce(ReduceAddition);

    var slope = MeanDiffXY / SquareXX;
    var intercept = yBar - (xBar * slope);

// returning regression function
    return function (x) {
        return x * slope + intercept;
    };
} */

function getMultipleData() {
    var MultipleData = headerNames.filter(function (d) {
       /* if (document.getElementById(d).selected) {
            if (d != "solution_id" && d != "ref_epoch" && d != "source_id" && d != "random_index") {
                return d;
            } else {
                alert("Please select those values that are not 'solution_id', 'ref_epoch', 'source_id' or 'random_index' ! ");
                document.getElementById(d).selected = false;
                return 0;
            }
        }
    });*/
        return d;

    return MultipleData;
}

function getOpacity() {
    return +document.getElementById("opacity").value;
}



function correlation(MultipleData) {
    var correlations = [];

    var filtered_data = csv_data.filter(function (d) {
        return MultipleData.reduce(function (acc, column) {
            return acc && +d[column] != null && +d[column] != -999 && !isNaN(+d[column]);
        }, true);
    });

    for (var i = 0; i < MultipleData.length; i++) {
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
            var corrValue = coeff;
            correlations.push(corrValue);
        }
    }
    return correlations;
}
