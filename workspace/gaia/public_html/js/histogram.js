
d3.csv("./data/GaiaSource_1.csv", function(d) {   
               return {
                ra_dec_corr : +d["l"]
               };
             }, function(error,data) {
             if (error) throw error;
            var dataset = data.map(function(d) { return d.ra_dec_corr; })
    

var color = "grey";
/*
var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;*/
    
    var margin = {
		top : 50,
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

var max = d3.max(dataset);
var min = d3.min(dataset);

var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

// binsize?
var data = d3.layout.histogram()
    .bins(x.ticks(Math.log2(dataset.length)+1))
    (dataset);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});

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
    return "<strong>Count   :</strong> <span style='color:white'>" + d3.format(",.0f")(d.y) + "</span>";
  });
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);
    
var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
.on('mouseover', tip.show)
      .on('mouseout', tip.hide);
bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d) { return colorScale(d.y) })
    .on("mouseover", function() {
            d3.select(this)
            	.attr("fill", "#2e2e30");
        })
    .on("mouseout", function() {
            d3.select(this).attr("fill", function(d) {
                return colorScale(d.y); })
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
      .attr("dy", ".80em")
      .style("text-anchor", "end")
      .text("Count: ");
        
      
}); 
