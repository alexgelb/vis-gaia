//import * as d3 from 'd3'
//import {Renderer, PCA} from '/src'
//const pcaClass = require('./pca')
/* global d3, d4 */

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

    if (getMultipleData() != 0) {
        drawScatterPlotMatrix(getMultipleData());
    } else {
        alert("Select please any values!");

    }
}

function deleteAll() {
    if (d3.select("svg") == 0) {
        alert("Nothing to delete!");
    }
    d3.select("svg").remove();
    headerNames.filter(function (d) {
        document.getElementById(d).selected = false;
    })
}

function drawScatterPlotMatrix(chosenValues) {

    var correlations = correlation(chosenValues);

    col = d3.scale.linear()
        .domain([-1, 0, 1])
        // .range(["#000000", "#A9E2F3", "#361CA0"]);
        .range(["#0174DF", "#A9E2F3", "#DF013A"]);

    var size = 230,
        padding = 40;

    var x = d4.scaleLinear()
        .range([padding / 2, size - padding / 2]);
    //    var x = d3.scale.linear()
    //            .range([padding / 2, size - padding / 2]);

    var y = d4.scaleLinear()
        .range([size - padding / 2, padding / 2]);
    //    var y = d3.scale.linear()
    //            .range([size - padding / 2, padding / 2]);


    var xAxis = d4.axisBottom()
        .scale(x);
    //    var xAxis = d3.svg.axis()
    //            .scale(x)
    //            .orient("bottom")

    var yAxis = d4.axisLeft()
        .scale(y);
    //    var yAxis = d3.svg.axis()
    //            .scale(y)
    //            .orient("left")

    var color = d4.scaleOrdinal(d4.schemeCategory10);
    //    var color = d3.scale.category10();

    var domainByTrait = {},
        traits = chosenValues,
        n = traits.length;

    traits.forEach(function (trait) {
        domainByTrait[trait] = d4.extent(csv_data, function (d) {
            var tmp = parseFloat(d[trait]);
            if (!isNaN(tmp) && tmp > -900) {
                return tmp;
            }
        });
    });


    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d4.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([[0, 0], [size, size]]);
    //    var brush = d3.svg.brush()
    //            .x(x)
    //            .y(y)
    //            .on("brushstart", brushstart)
    //            .on("brush", brushmove)
    //            .on("brushend", brushend);




    var svg = d4.select("#plot").append("svg")
        .attr("width", size * n + (padding + 100))
        .attr("height", size * n + (padding + 100))
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    var dy_em = ".80em";

    svg.selectAll(".x.axis")
        .data(traits)
        .enter()
        .append("g")

    .attr("class", "x axis")
        .attr("transform", function (d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function (d) {
            x.domain(domainByTrait[d]);
            d4.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter()
        .append("g")
        .attr("class", "y axis")

    .attr("transform", function (d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function (d) {
            y.domain(domainByTrait[d]);
            d4.select(this).call(yAxis);
        });

    var crossedData = cross(traits, traits);
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
    /* cell.filter(function (d) {
               return d.i === d.j;
               }).each(plot_histo);*/

    cell.filter(function (d) {
        return d.i === d.j;
    }).append("text")

    .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function (d) {
            return d.x;
        });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d, i) {
            if (isNaN(correlations[i])) {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + " - " + "</strong>";
            } else {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + correlations[i] + "</strong>";
            }

        });

    svg.call(tip);

    cell.filter(function (d) {
        return d.i < d.j;
    })

    .append("text")

    .attr("x", padding)
        .attr("y", padding)
        .attr("dy", "90px")
        .attr("dx", "75px")

    .style("text-anchor", "middle")
        .text(function (d, i) {
            return correlations[i].toFixed(3);
        })

    .style("font-size", function (d, i) {
        return (((size - padding) / 7) * (Math.abs(correlations[i]) + 0.7)) + "px";

    });

    d3.selectAll(".cell").filter(function (d) {
            return d.i < d.j;
        }).selectAll("text")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    // .style("fill", function (d, i) {
    //         if (correlations[i] === 1) {
    //            return "#000";
    //        } else {
    //          return col(correlations[i]);
    //        }
    //   })
    ;



    cell.filter(function (d) {
        return d.i !== d.j && d.i > d.j;
    }).call(brush);


    var histodaten = [];
    for (var j = 0; j < chosenValues.length; j++) { //j=0
        var dataset = csv_data.map(function (d) {
            return d[chosenValues[j]];
        });

        var f_dataset = dataset.filter(function (d) {
            return d != -999 && !isNaN(+d)
        });

        histodaten.push(f_dataset);
    };


    for (var i = 0; i < histodaten.length; i++) {

        plot_histo1(histodaten[i], chosenValues[i], d3.select(cell.filter(function (d) {
            return d.i == d.j;
        })._groups[0][i]));
    }



    d3.selectAll("line").attr("hidden", true);

    function plot_histo(p) {


        var cell = d4.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding)
            .style("fill", "#ffffff");

    }

    function plot_histo1(f_dataset, valuename, histocell) {





        var parameter = 6;
        var color = "grey";
        var dy_em = ".80em";

        // .attr("x", padding / 2)
        //    .attr("y", padding / 2)
        var width = size - padding,
            height = size - padding;

        var x = d3.scale.linear()
            .domain([d3.min(f_dataset), d3.max(f_dataset)])
            .range([0, width]);


        var bin = Math.log2(f_dataset.length) + 1;


        var dataset = d3.layout.histogram()
            .bins(x.ticks(bin))
            (f_dataset);

        var color2 = d3.scale.linear()
            .domain([d3.min(dataset, function (d) {
                return d.length
            }), d3.max(dataset, function (d) {
                return d.length
            })])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

        var y = d3.scale.linear()
            .domain([0, d3.max(dataset, function (d) {
                return d.length
            })])
            .range([height, 0]);


        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d, i) {
                return "<strong>" + valuename + ": </strong> <span style='color:white'>" + d3.format(",.0f")(d.y) + "</span>";
            });

        var svgObject =
            histocell.append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g");
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                    .attr("fill", "#2e2e30");
            })
            .on("mouseout", function () {
                d3.select(this).attr("fill", function (d) {
                    return color2(d.y);
                })
            });


        svgObject.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom"));

        svgObject.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis()
                .scale(y)
                .orient("left"))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", parameter)
            .attr("dy", dy_em);

    }

    function plot(p) {

        var cell = d4.select(this);

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
            .attr("r", 4)
            // change for different colours in clusters
            .style("fill", function (d) {
                return color("blue");
            });

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
    //    function brushstart(p) {
    //        if (brushCell !== this) {
    //            d3.select(brushCell).call(brush.clear());
    //            x.domain(domainByTrait[p.x]);
    //            y.domain(domainByTrait[p.y]);
    //            brushCell = this;
    //        }
    //    }


    function brushmove(p) {
        var e = d4.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function (d) {
            return !e ? false : (e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0] || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]);
        });
    }
    //    function brushmove(p) {
    //        var e = brush.extent();
    //        svg.selectAll("circle").classed("hidden", function (d) {
    //            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
    //                    || e[0][1] > d[p.y] || d[p.y] > e[1][1];
    //        });
    //    }

    function brushend() {
        var e = d4.brushSelection(this);
        if (e === null)
            svg.selectAll(".hidden").classed("hidden", false);
    }
    //    function brushend() {
    //        if (brush.empty())
    //            svg.selectAll(".hidden").classed("hidden", false);
    //    }

    function cross(a, b) {
        var c = [],
            n = a.length,
            m = b.length,
            i, j;
        for (i = -1; ++i < n;) {
            for (j = -1; ++j < m;) {
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

function getMultipleData() {
    var MultipleData = headerNames.filter(function (d) {
        if (document.getElementById(d).selected) {
            if (d != "solution_id" && d != "ref_epoch" && d != "source_id" && d != "random_index") {
                return d;
            } else {
                alert("Please select those values that are not 'solution_id', 'ref_epoch', 'source_id' or 'random_index' ! ");
                document.getElementById(d).selected = false;
                return 0;
            }
        }
    });

    return MultipleData;
}


function correlation(MultipleData) {
    var correlations = [];

    var filtered_data = csv_data.filter(function (d) {
        return MultipleData.reduce(function (acc, column) {
            return acc && +d[column] != null && +d[column] != -999 && !isNaN(+d[column]);
        }, true);
    });

    for (var i = 0; i < MultipleData.length; i++) {
        for (var j = i + 1; j < MultipleData.length; j++) { //j=0
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

            /*var corrValue = {
                x: MultipleData[i],
                y: MultipleData[j],
                value: coeff
            };*/
            var corrValue = coeff;
            correlations.push(corrValue);
        }
    }
    return correlations;
}

///////////////////// TODO delete

function drawCorrelogram(data) {
    var width_parameter, height_parameter;
    var range = d3.range(-1, 1.01, 0.01),
        count = 0;

    if (data.length <= 1) {
        alert("Choose more than one value please");
        return;
    }


    switch (true) {
    case (data.length <= 4):
        width_parameter = 400;
        height_parameter = 200;
        break;
    case (data.length == 9):
        width_parameter = 450;
        height_parameter = 300;
        break;
    case (data.length == 16 || data.length == 36):
        width_parameter = 600;
        height_parameter = 500;
        break;

    case (data.length == 64):
        width_parameter = 650;
        height_parameter = 550;
        break;
    case (data.length == 100):
        width_parameter = 700;
        height_parameter = 600;
        break;
    case (data.length > 100):
        width_parameter = 70 * Math.sqrt(data.length);
        height_parameter = 60 * Math.sqrt(data.length);
        break;
    default:
        width_parameter = 600;
        height_parameter = 500;
    }


    var margin = {
            top: 80,
            right: 200,
            bottom: 60,
            left: 80
        },
        width = width_parameter - margin.left - margin.right,
        height = height_parameter - margin.top - margin.bottom,
        domain = d3.set(data.map(function (d) {
            return d.x
        })).values(),
        n_elemente = Math.sqrt(data.length),
        col = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#000000", "#A9E2F3", "#361CA0"]);

    var x = d3.scale
        .ordinal()
        .rangePoints([0, width])
        .domain(domain),
        y = d3.scale
        .ordinal()
        .rangePoints([0, height])
        .domain(domain),
        x2 = x.range()[1] - x.range()[0],
        y2 = y.range()[1] - y.range()[0];

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            if (d.x === d.y) {
                return "<strong>" + d.x + "</strong> ";
            } else if (isNaN(d.value)) {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + " - " + "</strong>";
            } else {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + d.value + "</strong>";
            }

        });

    var svgObject = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("font", "12px", "sans-serif")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgObject.call(tip);

    var cor = svgObject.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        })
        .attr("class", "cor")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    cor.append("rect")
        .attr("stroke", "gray")
        .attr("id", "corr_rect")
        .attr("fill", "none")
        .attr("stroke-width", "1")
        .attr("height", y2)
        .attr("width", x2)

    .attr("x", -x2 / 2)
        .attr("y", -y2 / 2);


    cor.filter(function (d) {
            var xposition = domain.indexOf(d.x);
            var yposition = domain.indexOf(d.y);
            for (var i = (yposition + 1); i < n_elemente; i++) {
                if (i === xposition) return true;
            }
            return false;
        })
        .append("circle")
        .attr("r", function (d) {
            if (data.length <= 36) {
                return ((width / (n_elemente * 2)) * (Math.abs(d.value) + 0.06));
            } else if (data.length <= 900) {
                return ((width / (n_elemente * 2)) * (Math.abs(d.value) + 0.02));
            } else {
                return ((width / (n_elemente * 2)) * (Math.abs(d.value) - 0.02));
            }
        })
        .style("fill", function (d) {
            if (d.value === 1) {
                return "#000";
            } else {
                return col(d.value);
            }
        });

    cor.filter(function (d) {
            var xposition = domain.indexOf(d.x);
            var yposition = domain.indexOf(d.y);
            for (var i = yposition + 1; i < n_elemente; i++) {
                if (i === xposition) return false;
            }
            return true;
        })
        .append("text")
        .attr("y", 5)

    .text(function (d) {
        if (d.x === d.y) {
            return "val " + ++count; //d.x
        } else if (isNaN(d.value)) {
            return " - ";
        } else {
            return d.value.toFixed(2);
        }
    })

    .style("fill", function (d) {
        if (d.value === 1) {
            return "#000";
        } else {
            return col(d.value);
        }
    });

    d3.range(-1, 1.01, 0.01).forEach(function (d) {
        svgObject.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis()
                .orient("right")
                .scale(d3.scale
                    .linear()
                    .range([-margin.top + 9, height + margin.bottom - 5])
                    .domain([1, -1]))
                .tickPadding(7))
            .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)").append('rect')
            .style('fill', col(d))
            .style('stroke-width', 0)
            .style('stoke', 'none')
            .attr('height', height / range.length + 3)
            .attr('width', 10)
            .attr('x', 0)
            .attr('y', d3.scale
                .linear()
                .range([-margin.top + 9, height + margin.bottom - 5])
                .domain([1, -1])(d))
    });


}

function drawHistogram(xAxisValue, binSize) {

    var parameter = 6;
    var bin = 0;
    var color = "grey";
    var dy_em = ".80em";

    var dataset = csv_data.map(function (d) {
        return d[xAxisValue];
    });

    var f_dataset = dataset.filter(function (d) {
        return d != -999 && !isNaN(+d)
    });

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

    var x = d3.scale.linear()
        .domain([d3.min(f_dataset), d3.max(f_dataset)])
        .range([0, width]);

    if (binSize == 0) {
        bin = Math.log2(f_dataset.length) + 1;
    } else {
        bin = binSize;
    }

    var dataset = d3.layout.histogram()
        .bins(x.ticks(bin))
        (f_dataset);

    var color2 = d3.scale.linear()
        .domain([d3.min(dataset, function (d) {
            return d.length
        }), d3.max(dataset, function (d) {
            return d.length
        })])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.length
        })])
        .range([height, 0]);


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + xAxisValue + ": </strong> <span style='color:white'>" + d3.format(",.0f")(d.y) + "</span>";
        });

    var svgObject = d3.select("#plot")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                .attr("fill", "#2e2e30");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", function (d) {
                return color2(d.y);
            })
        });


    svgObject.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis()
            .scale(x)
            .orient("bottom"));

    svgObject.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis()
            .scale(y)
            .orient("left"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", parameter)
        .attr("dy", dy_em);

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