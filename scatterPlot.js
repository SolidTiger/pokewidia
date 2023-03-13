// import { pokemon_data } from "/pokemon_select.js";


var data = JSON.parse(sessionStorage.getItem("pokemon_data"));
var global_shown = null;
var zoomed = false;

// var k = d3.event.transform.k;

// console.log(data)
// var data = pokemon_data


// A function that update the chart
function update(shown_data = null, pokemon_data = null) {

    svg.transition()
            .call(zoom.transform, d3.zoomIdentity);
    //Ful-lösning, pokemonfactory räddar oss senare
    if(data == null) {
        data = pokemon_data
    }
    if(shown_data != null) global_shown = shown_data;

    var delay = 1000

    // if (zoomed) {
    //     svg.transition().duration(1000)
    //         .call(zoom.transform, d3.zoomIdentity);
    //     delay = 0
    // }
    // zoomed = false;
    
    x.domain([0, d3.max(data, function (d) { return d[optionX]; }) + 9])

    xAxis.transition().duration(delay).call(d3.axisBottom(x));

    y.domain([0, d3.max(data, function (d) { return d[optionY]; }) + 10])
    yAxis.transition().duration(delay).call(d3.axisLeft(y));

    var circles = scatter.selectAll("circle")
        .data(data);
    
    circles.enter()
        .append("circle")
        .attr("cx", function(d) { return x(d[optionX]); })
        .attr("cy", function(d) { return y(d[optionY]); })
        .attr("r", radius)
        .style("fill", color)
        .style("opacity", transparent)
        .on("mouseover", function(event, d) { 
            // d3.select(this).style("opacity", opace)
            tooltip
                .html(d.name)
                .style("opacity", 1)     
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) - 30 + "px")
            d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.75')
        })
        .on("mousemove", function(event, d) {
            tooltip.style("transform","translateY(-55%)")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) - 30 + "px")
        })
        .on('mouseout', function (event, d) {
            // d3.select(this).style("opacity", transparent)
            tooltip
                .style("opacity", 0)
                .style("left", "0px")
                .style("top",  "0px")
            d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        })
        .on("click", function(event, d) { 

            var grid = d3.selectAll(".square").filter(function(square) {return square.pokemon.name === d.name;});
            var image = d3.selectAll("#grid").selectAll("image").filter(function(image) {return image.pokemon.name === d.name;});

            grid.style("stroke", grid.style("stroke") === "none" ? "#555" : "none")

            var selected = d3.select(this)
            if(selected.style("opacity") === opace.toString()) {
                image.attr("selected", "false")
                global_shown = global_shown.filter(function(pokemon) { return pokemon.name !== d.name; })
                if(shown_data != null) {
                    shown_data = shown_data.filter(function(pokemon) { return pokemon.name !== d.name; })
                }
                selected.style("opacity", transparent)
            } else {
                image.attr("selected", "true")
                if(shown_data != null) {
                    shown_data.push(d)
                }
                global_shown.push(d)
                selected.style("opacity", opace)
            }
        })

        
    // circles.exit().remove();

    circles
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return x(d[optionX]); })
        .attr("cy", function(d) { return y(d[optionY]); })
        .attr("r", radius)
    circles
        .style("fill", color)
        .style("opacity", transparent)
        
    
    if(shown_data != null) {
        shown_data.forEach(element => {
            scatter
                .selectAll("circle")
                .filter(function(d) { return element.id == d.id; })
                .style("fill", selected_color)
                .style("opacity", opace)
        });
    }
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
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    .domain([0, 151 + 9])
    .range([0, width]);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .style("user-select", "none")

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 250 + 10])
    .range([height, 0]);
var yAxis = svg.append("g")
    .call(d3.axisLeft(y))
    .style("user-select", "none")

var radius = 7.5
var color = "#e97b5d"
var selected_color = "#e97b5d"

var transparent = 0.2
var opace = 1.0

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
    .attr('transform', 'translate(' + margin.left - width + ',' + margin.top - height + ')')
    // .call(zoom);

// Create the scatter variable: where both the circles and the brush take place
var scatter = svg.append('g')
    .attr("clip-path", "url(#clip)")

svg.call(zoom)

svg.on("wheel", function(event, d) {
    event.preventDefault();
})

update();