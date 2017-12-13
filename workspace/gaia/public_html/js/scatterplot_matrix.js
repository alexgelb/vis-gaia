/* global d3 */

var width = 960,
        size = 230,
        padding = 20;

var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

var xAxis = d3.axisBottom()
        .scale(x);
//        .ticks(6);

var yAxis = d3.axisLeft()
        .scale(y);
//        .ticks(6);

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("data/GaiaSource_1_small.csv", function (error, data) {
    if (error)
        throw error;

    var domainByTrait = {},
            traits = d3.keys(data[0]).filter(
            function (d) {
                return d === "pmra" || d === "pmdec" || d === "pmra_error";
//                return d;
            }),
            n = traits.length;


    traits.forEach(function (trait) {
        domainByTrait[trait] = d3.extent(data, function (d) {
            var tmp = parseFloat(d[trait]);
            if (!isNaN(tmp) && tmp > -900) {
                return tmp;
            }
        });
    });


    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.brush()
            .on("start", brushstart)
            .on("brush", brushmove)
            .on("end", brushend)
            .extent([[0, 0], [size, size]]);

    var svg = d3.select("body").append("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
            .data(traits)
            .enter()
//            .filter(function (d) {
//                return (d !== undefined) && !isNaN(d) && d > -900;
//            })
            .append("g")
            .attr("class", "x axis")
            .attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * size + ",0)";
            })
            .each(function (d) {
                x.domain(domainByTrait[d]);
                d3.select(this).call(xAxis);
            });

    svg.selectAll(".y.axis")
            .data(traits)
            .enter()
//            .filter(function (d) {
//                return (d !== undefined) && !isNaN(d) && d > -900;
//            })
            .append("g")
            .attr("class", "y axis")
            .attr("transform", function (d, i) {
                return "translate(0," + i * size + ")";
            })
            .each(function (d) {
                y.domain(domainByTrait[d]);
                d3.select(this).call(yAxis);
            });

    var cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
//            .filter(function (d) {
//                return (d !== undefined) && !isNaN(d) && d > -900;
//            })
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function (d) {
                return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
            })
            .each(plot);

// Titles for the diagonal.
    cell.filter(function (d) {
        return d.i === d.j;
    }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function (d) {
                return d.x;
            });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);
//    x.domain([-100, 100]);
//    y.domain([-100, 100]);

        cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

        cell.selectAll("circle")
                .data(data)
//                .filter(function (d) {
//                    return (d !== undefined) && (d.length > 0) && !isNaN(d) && d > -900;
//                })
                .enter().append("circle")
                .attr("cx", function (d) {
                    return x(d[p.x]);
                })
                .attr("cy", function (d) {
                    return y(d[p.y]);
                })
                .attr("r", 4)
                .style("fill", function (d) {
                    return color(d.species);
                });
    }

    var brushCell;

// Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
        }
    }

// Highlight the selected circles.
    function brushmove(p) {
        var e = d3.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function (d) {
            return !e ? false : (e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
                    || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
                    );
        });
    }

// If the brush is empty, select all circles.
    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null)
            svg.selectAll(".hidden").classed("hidden", false);
    }
}
);

function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = - 1; ++i < n; )
        for (j = - 1; ++j < m; )
            c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
}

