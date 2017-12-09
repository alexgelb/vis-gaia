/* global d3 */
var value = 0;
var headerNames = [];
var MultipleData = [];
var csv_data;

d3.csv("./data/GaiaSource_1.csv",
		function(csv_data) {
			var traits = d3.keys(csv_data[0]).filter(
					function(d) {
						return d !== "astrometric_primary_flag"
								&& d !== "duplicated_source"
								&& d !== "phot_variable_flag";
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
    var dataMultiple = document.getElementById("MultipleData");
	var MultipleDataValue = xAxis.options[dataMultiple.selectedIndex].text;
    
    var binSize = document.getElementById("BinSize").value;
	
    
	if (document.getElementById("scatterplotType").checked) {
		drawScatterplot(xAxisValue, yAxisValue);
	} else if (document.getElementById("barplotType").checked) {
		drawScatterplot(xAxisValue, yAxisValue);
	} else if (document.getElementById("scattermatrixType").checked) {
		//drawScattermatrix(getMultipleData());
		getMultipleData();
		//correlation(MultipleDataValue);
	}
    
    else if (document.getElementById("histogramType").checked) {
		// drawHistogram(xAxisValue, binSize);
	}
	
}

function drawScatterplot(xAxisValue, yAxisValue) {
	var margin = {
		top : 20,
		right : 20,
		bottom : 110,
		left : 60
	}, margin2 = {
		top : 230,
		right : 20,
		bottom : 30,
		left : 40
	}, width = 660 - margin.left - margin.right, height = 300 - margin.top
			- margin.bottom, height2 = 300 - margin2.top - margin2.bottom;
	var x1 = d3.scaleTime().range([ 0, width ]), x2 = d3.scaleTime().range(
			[ 0, width ]), y1 = d3.scaleLinear().range([ height, 0 ]), y2 = d3
			.scaleLinear().range([ height2, 0 ]);
	var xAxis1 = d3.axisBottom(x1), xAxis2 = d3.axisBottom(x2), yAxis1 = d3
			.axisLeft(y1);
	var scatterSVG = d3.select("#plot").append("svg").attr("height",
			(height + margin.top + margin.bottom + 10));
	scatterSVG.append("defs").append("clipPath").attr("id", "clip").append(
			"rect").attr("width", width).attr("height", height);
	var focusView = scatterSVG.append("g").attr("class", "focusView").attr(
			"transform", "translate(" + margin.left + "," + margin.top + ")");
	var brush = d3.brushX().extent([ [ 0, 0 ], [ width, height2 ] ]).on("end",
			brushed);
	var contextView = scatterSVG.append("g").attr("class", "contextView").attr(
			"transform", "translate(" + margin.left + "," + margin2.top + ")");

	var xText = "X-Values";
	var yText = "Y-Values";

	x1.domain(d3.extent(csv_data, function(d) {
		return d[xAxisValue];
	}));
	y1.domain([ 0, d3.max(csv_data, function(d) {
		return d[yAxisValue];
	}) ]);
	x2.domain(x1.domain());
	y2.domain(y1.domain());
	var dots = focusView.append("g");
	dots.attr("clip-path", "url(#clip)");
	dots.selectAll("dot").data(csv_data).enter()
	// .filter(function (d) {
	// return (d.distance !== undefined) && !isNaN(y1(d.distance));
	// })
	.append("circle").attr('class', 'dot').attr("r", 2).style("opacity", .5)
			.attr("cx", function(d) {
				return x1(d[xAxisValue]);
			}).attr("cy", function(d) {
				return y1(d[yAxisValue]);
			}).on("click", function() {
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
			"translate(" + ((width + margin.right + margin.left) / 2) + " ,"
					+ (height + margin.top + margin.bottom + 10) + ")").style(
			"text-anchor", "middle").text(yAxisValue);
	var dots = contextView.append("g");
	dots.attr("clip-path", "url(#clip)");
	dots.selectAll("dot").data(csv_data).enter()
	// .filter(function (d) {
	// return (d.distance !== undefined) && !isNaN(y2(d.distance));
	// })
	.append("circle").attr('class', 'dotcontextView').attr("r", 1).style(
			"opacity", .5).attr("cx", function(d) {
		return x2(d[xAxisValue]);
	}).attr("cy", function(d) {
		return y2(d[yAxisValue]);
	});
	contextView.append("g").attr("class", "axis x-axis").attr("transform",
			"translate(0," + height2 + ")").call(xAxis2);
	contextView.append("g").attr("class", "brush").call(brush).call(brush.move,
			x1.range());
	function brushed() {
		var selection = d3.event.selection;
		x1.domain(selection.map(x2.invert, x2));
		focusView.selectAll(".dot").attr("cx", function(d) {
			return x1(d[xAxisValue]);
		}).attr("cy", function(d) {
			return y1(d[yAxisValue]);
		});
		focusView.select(".x-axis").call(xAxis1);
	}
}


function getMultipleData() {
	MultipleData = headerNames.filter(function(d) {
		if (document.getElementById(d).selected)
			return d;
        
	});
    if (MultipleData.length>5) {
        alert("You can select only 5 values!");
        MultipleData=0;
    }
  //  console.log(MultipleData);
}

/*
function getCheckedBoxes() {
	checkedBoxes = headerNames.filter(function(d) {
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
	var column1, column2;
	var correlations = [];
	// TODO Nicole dynamisch machen
	for (var i = 0; i < 4; i++) {
		for (var j = i + 1; j < 5; j++) {
			column1 = csv_data.map(function(d) {
				return +d[MultipleData[i]]
			});
			column2 = csv_data.map(function(d) {
				return +d[MultipleData[j]]
			});

			var avg1 = d3.sum(column1, function(d) {
				return +d[MultipleData[i]]
			}) / column1.length;

			var avg2 = d3.sum(column2, function(d) {
				return +d[MultipleData[j]]
			}) / column2.length;

			correlations.push(d3.sum(column1, function(d) {
				return column1.forEach(function(d, i) {
					return (d - avg1) * (column2[i] - avg2)
				})
			}) / Math.sqrt(d3.sum(column1, function(d, i) {
				return column1.forEach(function(d) {
					return Math.pow((d - avg1), 2)
				})
			}) * d3.sum(csv_data, function(d, i) {
				return Math.pow((column2[i] - avg2), 2)
			})));
		}
	}
	console.log(correlations);
}

function histogramActive()
{
   if(document.getElementById("histogramType").checked)
   {
      document.getElementById("xAxisValue").disabled=false;
       document.getElementById("BinSize").disabled=false;
   }
   else
   {
      document.getElementById("xAxisValue").disabled=true;
       document.getElementById("BinSize").disabled=true;
   }
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
		document.getElementById("xAxisValue").disabled=false;
       document.getElementById("yAxisValue").disabled=false;
	}
    else if (document.getElementById("histogramType").checked){ 
        document.getElementById("xAxisValue").disabled=false;
    }
    else  {
        document.getElementById("xAxisValue").disabled=true;
       document.getElementById("yAxisValue").disabled=true;
    }
    
    if(document.getElementById("scattermatrixType").checked)
   {
      document.getElementById("MultipleData").disabled=false;
       
   }
   else
   {
      document.getElementById("MultipleData").disabled=true;

   }
}


