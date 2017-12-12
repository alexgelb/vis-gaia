//import * as d3 from 'd3'
//import {Renderer, PCA} from '/src'
//const pcaClass = require('./pca')

// TODO DataPlots-Bereich von size plots abhängig machen ?

/* global d3 */
var value = 0;
var headerNames = [];
var csv_data;


d3.csv("./data/GaiaSource_1.csv",
    function(csv_data) {
        var traits = d3.keys(csv_data[0]).filter(
            function(d) {
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
        var multipleValue = document.getElementById("MultipleData");


        for (var i = 0; i < headerNames.length; i++) {
            var xAxisOption = document.createElement("option");
            var multipleOption = document.createElement("option");
            xAxisOption.text = headerNames[i];
            multipleOption.text = headerNames[i];
            multipleOption.id = headerNames[i];

            xAxis.add(xAxisOption);
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

    var binSize;
    if (document.getElementById("histogramType").checked) {
        switch (xAxisValue) {
            case "source_id":
                alert("Don't choose source_id for this plottype!");
                return;
                break;
            case "random_index":
                alert("Don't choose random_index for this plottype!");
                return;
                break;
            case "solution_id":
                alert("Don't choose solution_id for this plottype!");
                return;
                break;
            case "ref_epoch":
                alert("Don't choose ref_epoch for this plottype!");
                return;
                break;
            default:
                break;
        }

    }

    if (document.getElementById("scattermatrixType").checked) {
        // TODO: drawScattermatrix(getMultipleData());

    } else if (document.getElementById("histogramType").checked) {
        if (document.getElementById("binCheck").checked) {
            binSize = document.getElementById("BinSize").value;
        } else {
            binSize = 0;
        }
        drawHistogram(xAxisValue, binSize);


    } else if (document.getElementById("correlogramType").checked) {
        //var dataMultiple = document.getElementById("MultipleData");
        //var MultipleDataValue = xAxis.options[dataMultiple.selectedIndex].text;
        drawCorrelogram(correlation(getMultipleData()));
    } else if (document.getElementById("pcaType").checked) {
        drawPCA();
    } else {
        console.log("NONE");
        alert("Choose a type of plot please!");
    }
}

function deleteAll() {
    d3.select("svg").remove();
}

function drawCorrelogram(data) {


    if (data.length <= 1) {
        alert("Choose more than one value please");
        return;
    }

    var width_parameter, height_parameter;
    switch (true) {
        case (data.length <= 4):
            width_parameter = 400;
            height_parameter = 250;
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
        domain = d3.set(data.map(function(d) {
            return d.x
        })).values(),
        num = Math.sqrt(data.length),
        color = d3.scale.linear()
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
        xSpace = x.range()[1] - x.range()[0],
        ySpace = y.range()[1] - y.range()[0];

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            if (d.x === d.y) {
                return "<strong>" + d.x + "</strong> ";
            } else if (isNaN(d.value)) {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + " - " + "</strong>";
            }
            else {
                return "<strong> corr ( </strong>" + d.x + " | \n" + d.y + "<strong>)</strong> = <strong>" + d.value + "</strong>";
            }

        });
    var svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("font", "12px", "sans-serif")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.call(tip);


    var cor = svg.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    cor.append("rect")
        .attr("id", "corr_rect")
        .attr("stroke", "gray")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("width", xSpace)
        .attr("height", ySpace)
        .attr("x", -xSpace / 2)
        .attr("y", -ySpace / 2)
    var g = 0;
    cor.filter(function(d) {
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            for (var i = (ypos + 1); i < num; i++) {
                if (i === xpos) return false;
            }
            return true;
        })
        .append("text")
        .attr("y", 5)

        .text(function(d) {
            if (d.x === d.y) {
                return "val " + ++g; //d.x
            } else if (isNaN(d.value)){
                return " - ";
            } else {
                return d.value.toFixed(2);
            }   
            })
        
        .style("fill", function(d) {
            if (d.value === 1) {
                return "#000";
            } else {
                return color(d.value);
            }
        });

    cor.filter(function(d) {
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            for (var i = (ypos + 1); i < num; i++) {
                if (i === xpos) return true;
            }
            return false;
        })
        .append("circle")
        .attr("r", function(d) {
            if (data.length <= 36) {
                return ((width / (num * 2)) * (Math.abs(d.value) + 0.06));
            } else if (data.length <= 900) {
                return ((width / (num * 2)) * (Math.abs(d.value) + 0.02));
            } else {
                return ((width / (num * 2)) * (Math.abs(d.value) - 0.02));
            }
        })
        .style("fill", function(d) {
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

    iR.forEach(function(d) {
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
    var dataset = csv_data.map(function(d) {
        return d[xAxisValue];
    });

    var f_dataset = dataset.filter(function(d) {
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

    var max = d3.max(f_dataset);
    var min = d3.min(f_dataset);

    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);


    if (binSize == 0) {
        bin = Math.log2(f_dataset.length) + 1;
    } else {
        bin = binSize;
    }

    var data = d3.layout.histogram()
        .bins(x.ticks(bin))
        (f_dataset);

    var yMax = d3.max(data, function(d) {
        return d.length
    });
    var yMin = d3.min(data, function(d) {
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
        .html(function(d) {
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
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    if (typeof(data[0]) == "undefined") {
        alert("Change your bin size or X-Axis-Value please!");
        deleteAll();
        return;
    }



    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) {
            return height - y(d.y);
        })
        .attr("fill", function(d) {
            return colorScale(d.y)
        })
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", "#2e2e30");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", function(d) {
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

// TODO vllt einfach astrometric_prios_used raus wegen NaN bei corr.werte ??

function getMultipleData() {
    var MultipleData = headerNames.filter(function(d) {
        if (document.getElementById(d).selected) {
            if (d != "solution_id" && d != "ref_epoch") {
                return d;
            } else if (d == "solution_id") {
                alert("Don't choose solution_id for this plottype!");

            } else if (d == "ref_epoch") {
                alert("Don't choose ref_epoch for this plottype!");
            }
        }
    });

    return MultipleData;
}


// TODO was ist mit astrometric_prios_used los?, scheißvis :/

function correlation(MultipleData) {
    var correlations = [];

    var filtered_data = csv_data.filter(function(d) {
        return MultipleData.reduce(function(acc, column) {
            return acc && +d[column] && +d[column] != -999 && !isNaN(+d[column]);
        }, true);
    });

    for (var i = 0; i < MultipleData.length; i++) {

        for (var j = 0; j < MultipleData.length; j++) {
            var col1 = filtered_data.map(function(d) {
                return +d[MultipleData[i]]
            });

            var col2 = filtered_data.map(function(d) {
                return +d[MultipleData[j]]
            });

            var avg_col1 = d3.sum(col1, function(d) {
                return d
            }) / col1.length;

            var avg_col2 = d3.sum(col2, function(d) {
                return d
            }) / col2.length;

            var coeff = d3.sum(col1.map(function(d, i) {
                return (d - avg_col1) * (col2[i] - avg_col2)
            }), function(d) {
                return d
            }) / Math.sqrt(
                d3.sum(col1.map(function(d) {
                    return Math.pow((d - avg_col1), 2)
                }), function(d) {
                    return d
                }) * d3.sum(col2.map(function(d) {
                    return Math.pow((d - avg_col2), 2)
                }), function(d) {
                    return d
                })
            );
            
            var corrValue = {
                x: MultipleData[i],
                y: MultipleData[j],
                value: coeff
            };
            correlations.push(corrValue);

        }


    }
    return correlations;
}


function histogramActive() {


    if (document.getElementById("histogramType").checked) {
        document.getElementById("xAxisValue").disabled = false;
        document.getElementById("binCheck").disabled = false;
    } else {
        document.getElementById("xAxisValue").disabled = true;
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
    } else {
        document.getElementById("BinSize").disabled = true;

    }
}
