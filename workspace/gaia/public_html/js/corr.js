// data Beispiel
// TODO Nicole: anstatt bespiel, array von objects mit correlations von multiple data
    
var data = [
{ x: "val1", y: "val1", value: 1 },
{ x: "val1", y: "val2", value: -0.852161959426613 },
{ x: "val1", y: "val3", value: -0.847551379262479 },
{ x: "val1", y: "val4", value: -0.776168371826586 },
{ x: "val1", y: "val5", value: 0.681171907806749 },
{ x: "val1", y: "val6", value: -0.867659376517228 },
{ x: "val1", y: "val7", value: 0.418684033921778 },
{ x: "val1", y: "val8", value: 0.664038919127593 },
{ x: "val1", y: "val9", value: 0.599832429454648 },
{ x: "val1", y: "val10", value: 0.480284757338842 },
{ x: "val2", y: "val1", value: -0.852161959426613 },
{ x: "val2", y: "val2", value: 1 },
{ x: "val2", y: "val3", value: 0.902032872146999 },
{ x: "val2", y: "val4", value: 0.83244745272182 },
{ x: "val2", y: "val5", value: -0.69993811382877 },
{ x: "val2", y: "val6", value: 0.782495794463241 },
{ x: "val2", y: "val7", value: -0.591242073768869 },
{ x: "val2", y: "val8", value: -0.810811796083005 },
{ x: "val2", y: "val9", value: -0.522607046900675 },
{ x: "val2", y: "val10", value: -0.492686599389471 },
{ x: "val3", y: "val1", value: -0.847551379262479 },
{ x: "val3", y: "val2", value: 0.902032872146999 },
{ x: "val3", y: "val3", value: 1 },
{ x: "val3", y: "val4", value: 0.790948586369806 },
{ x: "val3", y: "val5", value: -0.71021392716927 },
{ x: "val3", y: "val6", value: 0.887979922058138 },
{ x: "val3", y: "val7", value: -0.433697880811014 },
{ x: "val3", y: "val8", value: -0.7104158907906 },
{ x: "val3", y: "val9", value: -0.591227040063948 },
{ x: "val3", y: "val10", value: -0.555569198562483 },
{ x: "val4", y: "val1", value: -0.776168371826586 },
{ x: "val4", y: "val2", value: 0.83244745272182 },
{ x: "val4", y: "val3", value: 0.790948586369806 },
{ x: "val4", y: "val4", value: 1 },
{ x: "val4", y: "val5", value: -0.44875911687292 },
{ x: "val4", y: "val6", value: 0.658747887344759 },
{ x: "val4", y: "val7", value: -0.708223388861953 },
{ x: "val4", y: "val8", value: -0.72309673735245 },
{ x: "val4", y: "val9", value: -0.243204257185851 },
{ x: "val4", y: "val10", value: -0.125704258225474 },
{ x: "val5", y: "val1", value: 0.681171907806749 },
{ x: "val5", y: "val2", value: -0.69993811382877 },
{ x: "val5", y: "val3", value: -0.71021392716927 },
{ x: "val5", y: "val4", value: -0.44875911687292 },
{ x: "val5", y: "val5", value: 1 },
{ x: "val5", y: "val6", value: -0.712440646697372 },
{ x: "val5", y: "val7", value: 0.091204759651183 },
{ x: "val5", y: "val8", value: 0.440278464955349 },
{ x: "val5", y: "val9", value: 0.71271112722627 },
{ x: "val5", y: "val10", value: 0.699610131934665 },
{ x: "val6", y: "val1", value: -0.867659376517228 },
{ x: "val6", y: "val2", value: 0.782495794463241 },
{ x: "val6", y: "val3", value: 0.887979922058138 },
{ x: "val6", y: "val4", value: 0.658747887344759 },
{ x: "val6", y: "val5", value: -0.712440646697372 },
{ x: "val6", y: "val6", value: 1 },
{ x: "val6", y: "val7", value: -0.174715878713405 },
{ x: "val6", y: "val8", value: -0.554915677663994 },
{ x: "val6", y: "val9", value: -0.692495258839484 },
{ x: "val6", y: "val10", value: -0.583286996536648 },
{ x: "val7", y: "val1", value: 0.418684033921778 },
{ x: "val7", y: "val2", value: -0.591242073768869 },
{ x: "val7", y: "val3", value: -0.433697880811014 },
{ x: "val7", y: "val4", value: -0.708223388861953 },
{ x: "val7", y: "val5", value: 0.091204759651183 },
{ x: "val7", y: "val6", value: -0.174715878713405 },
{ x: "val7", y: "val7", value: 1 },
{ x: "val7", y: "val8", value: 0.744535443526254 },
{ x: "val7", y: "val9", value: -0.229860862184883 },
{ x: "val7", y: "val10", value: -0.212682229720365 },
{ x: "val8", y: "val1", value: 0.664038919127593 },
{ x: "val8", y: "val2", value: -0.810811796083005 },
{ x: "val8", y: "val3", value: -0.7104158907906 },
{ x: "val8", y: "val4", value: -0.72309673735245 },
{ x: "val8", y: "val5", value: 0.440278464955349 },
{ x: "val8", y: "val6", value: -0.554915677663994 },
{ x: "val8", y: "val7", value: 0.744535443526254 },
{ x: "val8", y: "val8", value: 1 },
{ x: "val8", y: "val9", value: 0.168345124585359 },
{ x: "val8", y: "val10", value: 0.206023348733579 },
{ x: "val9", y: "val1", value: 0.599832429454648 },
{ x: "val9", y: "val2", value: -0.522607046900675 },
{ x: "val9", y: "val3", value: -0.591227040063948 },
{ x: "val9", y: "val4", value: -0.243204257185851 },
{ x: "val9", y: "val5", value: 0.71271112722627 },
{ x: "val9", y: "val6", value: -0.692495258839484 },
{ x: "val9", y: "val7", value: -0.229860862184883 },
{ x: "val9", y: "val8", value: 0.168345124585359 },
{ x: "val9", y: "val9", value: 1 },
{ x: "val9", y: "val10", value: 0.794058760256343 },
{ x: "val10", y: "val1", value: 0.480284757338842 },
{ x: "val10", y: "val2", value: -0.492686599389471 },
{ x: "val10", y: "val3", value: -0.555569198562483 },
{ x: "val10", y: "val4", value: -0.125704258225474 },
{ x: "val10", y: "val5", value: 0.699610131934665 },
{ x: "val10", y: "val6", value: -0.583286996536648 },
{ x: "val10", y: "val7", value: -0.212682229720365 },
{ x: "val10", y: "val8", value: 0.206023348733579 },
{ x: "val10", y: "val9", value: 0.794058760256343 },
{ x: "val10", y: "val10", value: 1 }
    ];
    
var margin = {
        top: 25,
        right: 80,
        bottom: 25,
        left: 25
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    domain = d3.set(data.map(function(d) {
        return d.x
    })).values(),
    num = Math.sqrt(data.length),
    color = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["#B22222", "#fff", "#000080"]);

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

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cor = svg.selectAll(".cor")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "cor")
    .attr("transform", function(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

cor.append("rect")
    .attr("width", xSpace)
    .attr("height", ySpace)
    .attr("x", -xSpace / 2)
    .attr("y", -ySpace / 2)

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
            return d.x;
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
    .attr("r", function(d){
    return (width / (num * 2)) * (Math.abs(d.value) + 0.15);
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
    .range([-margin.top + 5, height + margin.bottom - 5])
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