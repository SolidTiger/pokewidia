// import { pokemon_data } from "/pokemon_select.js";


var data = JSON.parse(sessionStorage.getItem("pokemon_data"));
var global_shown = null;
var zoomed = false;

// var k = d3.event.transform.k;

// console.log(data)
// var data = pokemon_data

// A function that update the chart
function update(shown_data = null, pokemon_data = null) {
    //Ful-lösning, pokemonfactory räddar oss senare
    if(data == null) {
        data = pokemon_data
    }
    if(shown_data != null) global_shown = shown_data;

    var delay = 1000

    if (zoomed) {
        svg.selectAll("rect").transition().duration(1000)
            .call(zoom.transform, d3.zoomIdentity);
        delay = 0
    }
    zoomed = false;

    x.domain([0, d3.max(data, function (d) { return d[optionX]; })])
    xAxis.transition().duration(delay).call(d3.axisBottom(x));

    y.domain([0, d3.max(data, function (d) { return d[optionY]; })])
    yAxis.transition().duration(delay).call(d3.axisLeft(y));
/*
    scatter
        .selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d[optionX]); })
        .attr("cy", function (d) { return y(d[optionY]); })
        .attr("r", radius)
        .style("fill", color)*/

    var circles = scatter.selectAll("circle")
        .data(data);

    circles.enter()
        .append("circle")
        .attr("cx", function(d) { return x(d[optionX]); })
        .attr("cy", function(d) { return y(d[optionY]); })
        .attr("r", radius)
        .style("fill", color)
        .style("opacity", 0.2)


    circles.exit().remove();

    circles
        // .transition()
        // .duration(1000)
        .attr("cx", function(d) { return x(d[optionX]); })
        .attr("cy", function(d) { return y(d[optionY]); })
        .attr("r", radius)
        // .transition()
        // .duration(1)
        .style("fill", color)
        .style("opacity", 0.2)
    
    if(shown_data != null) {
        shown_data.forEach(element => {
            scatter
                // .transition()
                // .duration(1000)
                .selectAll("circle")
                .filter(function(d) { return element.id == d.id; })
                // .transition()
                // .duration(1)
                .style("fill", color)
                .style("opacity", 1.0)
                // .attr("r", radius*2.0);
        });
    }
    

        /*
    scatter.append('g')
        // .selectAll("dot")
        .data(data)
        .transition()
        .duration(1000)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[optionX]); })
        .attr("cy", function (d) { return y(d[optionY]); })
        .attr("r", radius)
        .style("fill", color)*/
        //.exit()
        // .remove()

}

// A function that updates the chart when the user zoom and thus new boundaries are available
function updateChart({transform}) {
    zoomed = true;

    // recover the new scale
    var newX = transform.rescaleX(x);
    var newY = transform.rescaleY(y);
    
    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    // update circle position
    scatter
        .selectAll("circle")
        .attr('cx', function (d) { return newX(d[optionX]) })
        .attr('cy', function (d) { return newY(d[optionY]) });
}



// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// CODE STARTS HERE

// append the svg object to the body of the page
var svg = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

// List of groups
var allGroup = ["id", "hp", "attack", "defense", "speed", "specialAttack"]

var optionX = "id"
var optionY = "hp"

// add the options to the button
d3.select("#selectX")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

d3.select("#selectX")
    .property("value", optionX)

d3.select("#selectY")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

d3.select("#selectY")
    .property("value", optionY)

// Add X axis
var x = d3.scaleLinear()
    .domain([0, 151])
    .range([0, width]);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 250])
    .range([height, 0]);
var yAxis = svg.append("g")
    .call(d3.axisLeft(y));

var radius = 5.0
var color = "#e97b5d"

// Create the scatter variable: where both the circles and the brush take place
var scatter = svg.append('g')
    .attr("clip-path", "url(#clip)")
/*
scatter.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d[optionX]); })
    .attr("cy", function (d) { return y(d[optionY]); })
    .attr("r", radius)
    .style("fill", color)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)*/

// When the button is changed, run the updateChart function
d3.select("#selectX").on("change", function (d) {
    // recover the option that has been chosen
    optionX = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(global_shown)
})

d3.select("#selectY").on("change", function (d) {
    // recover the option that has been chosen
    optionY = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(global_shown)
})

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
var zoom = d3.zoom()
    .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([[0, 0], [width, height]])
    .on("zoom", updateChart);

// This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(zoom);

update();

/*
// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
var tooltip = d3.select("#scatterPlot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
var mouseover = function (d) {
    tooltip
        .style("opacity", 1)
}

var mousemove = function (d) {
    tooltip
        .html("The exact value of<br>the Ground Living area is: " + d[optionX])
        .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function (d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}*/