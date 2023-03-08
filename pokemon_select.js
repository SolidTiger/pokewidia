
const getPokemonData = async (term) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
    const data = await response.json();
    return data;
}

var pokemon_data = [];
var promises = [];
var shown_data = [];
//Grid used for displaying the choosable pokémon
var gridData = new Array();
const num_rows = 16;
const num_cols = 10;


//Temporary solution to get pokemon data
//Fetches all starter pokemon from gen 1, including their evolutions
//This could probably be done in a better way, not using a for loop
for(let i = 1; i < 152; i++) {
    promises.push(getPokemonData(i))
}

//Solution to wait for all fethces to be done
Promise.all(promises).then((data) => {
    data.forEach((pokemon) => {
        pokemon_data.push({
            group: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            id: pokemon.id,
            value: pokemon.stats,
            img: pokemon.sprites.other.dream_world.front_default
        });
    })
    initgrid(num_rows, num_cols, pokemon_data, 151) 
    update(shown_data)
})

/**
 * Initialization of the graph
 **/
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 660 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
.range([ 0, width ])
.padding(0.2);
var xAxis = svg.append("g")
.attr("transform", "translate(0," + height + ")")


// Initialize the Y axis
var y = d3.scaleLinear()
.range([ height, 0]);
var yAxis = svg.append("g")
.attr("class", "myYaxis")


//Y-axis label 
svg.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("y", -margin.left+20)
.attr("x", -margin.top-170)
.text("Hitpoints (HP)")

//Tooltip for hovering over bars
const tooltip = d3.select("#my_dataviz")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
.style("position", "absolute")
.style("z-index", 5)

//Function for initializing the grid
function initgrid(num_rows, num_cols, pokemon_data, limit) {

    var xpos = 1; 
    var ypos = 1; 
    var width = 60; 
    var height = 60;
    var x_offset = 5;
    var y_offset = 5; 
    
    for(let row = 0; row < num_rows; row++) {
        gridData.push(new Array());
        
        for(var column = 0; column < num_cols; column++) {
            if(row*num_cols + column >= limit) {
                break;
            }
            gridData[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                pokemon: pokemon_data[row*num_cols + column]
            })
            xpos += width + x_offset;
        }
        xpos = 1;
        ypos += height + y_offset; 
    }

    var grid = d3.select("#grid")
    .attr("sort_order", 0)
    .append("svg")
    .attr("width", num_cols * (width + x_offset) + "px")
    .attr("height", num_rows * (height + y_offset) + "px");
    
    var row = grid.selectAll(".row")
    .data(gridData)
    .enter().append("g")
    .attr("class", "row");

    var column = row.selectAll(".square")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .attr("pokemon", function(d) {return d.pokemon })
    .style("fill", "white")
    .style("stroke-width", "1.5px")
    .style("stroke", "none")
    .style("rx", "8px")
    .style("ry", "8px")

    //The pokemon images
    var images = row.selectAll(".image")
    .data(function(d) { return d; })
    .enter().append("svg:image")
    .attr("class","image")
    .attr("x", function(d) { return d.x+5; })
    .attr("y", function(d) { return d.y+5; })
    .attr("width", width-10)
    .attr("height", height-10)
    .attr("selected", "false")
    .attr("xlink:href", function(d) { return d.pokemon.img; })
    .on("click", function(event, d) { 
            //Click event for selecting a pokemon
            var column = d3.selectAll(".square")
            .filter(function(square) { return square.x === d.x && square.y == d.y; });
            
            //Transitions not working atm for some reason
            column
            .style("stroke", function() {
                return d3.select(this).style("stroke") === "none" ? "black" : "none";
            })
            // .style("fill", function() { 
            //     return d3.select(this).style("fill") === "white" ? "#ce2312" : "white"; 
            // })
            //These should be added before
            .transition()
            .duration(10)

            
            if(d3.select(this).attr("selected") === "false") {
                d3.select(this).attr("selected", "true")
                shown_data.push(d.pokemon)
            }
            else {
                d3.select(this).attr("selected", "false")
                //Delete the pokemon from the array 
                shown_data = shown_data.filter(function(pokemon) { return pokemon.group !== d.pokemon.group; })
            }
            update(shown_data)
    })
    .on("mouseover", function(event, d) { 
            tooltip
                .html(d.pokemon.group)
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
        tooltip
            .style("opacity", 0)
            .style("left", "0px")
            .style("top",  "0px")
        d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
    })
    images.exit().remove()


    //Initialize the graph with the first 3 pokemon and reflect it in the filling of the grid
    // shown_data = pokemon_data.slice(0, 3)
    // shown_data.forEach(function(pokemon) {
    //     var column = d3.selectAll(".square")
    //     .filter(function(square) { return square.pokemon.group === pokemon.group; });
    //     column
    //     .style("stroke", function() {
    //         return d3.select(this).style("stroke") === "none" ? "black" : "none";
    //     })
        
    //     var image = d3.selectAll(".image")
    //     .filter(function(square) { return square.pokemon.group === pokemon.group; });
    //     image
    //     .attr("selected", "true")
    // })   
}

function update_grid(sortBy) {
    //If the grid is already sorted by sortBy, exit function
    if(sortBy == d3.select("#grid").attr("sort_order"))
        return; 
    

    //Sort the pokemon_data array by the sortBy parameter
    pokemon_data.sort(function(b, a) {
        switch(sortBy) {
            case 0: return b.id - a.id; break; 
            case 1: return a.value[0].base_stat - b.value[0].base_stat; break;
            case 2: return a.value[1].base_stat - b.value[1].base_stat; break;
            case 3: return a.value[2].base_stat - b.value[2].base_stat; break;
            case 4: return a.value[5].base_stat - b.value[5].base_stat; break;
            case 5: return a.value[3].base_stat - b.value[3].base_stat; break;
            default: break; 
        }
    });

    //Set the grid attribute to the sortBy parameter
    d3.select("#grid").attr("sort_order", sortBy);

    //Remove previous selections
    shown_data.forEach(function(pokemon) {
        var column = d3.selectAll(".square")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        column
        .style("stroke", "none")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        image
        .attr("selected", "false")
    })

    for(let i = 0; i < num_rows; i++) {
        for(let j = 0; j < num_cols; j++) {
            if(i*num_cols + j >= 151) {
                break;
            }
            if(gridData[i] && gridData[i][j]) {
                gridData[i][j].pokemon = pokemon_data[i*num_cols + j]
            }
        }
    }
    
    //Update the grid with the new data
    var rows = d3.select("#grid").selectAll(".row")
    .data(gridData)

    var columns = rows.selectAll(".square")
    .data(function(d) { return d; }) 

    var images = rows.selectAll(".image")
    .data(function(d) { return d; })
    .attr("xlink:href", function(d) { return d.pokemon.img; })


    //Move the new selections
    shown_data.forEach(function(pokemon) {
        var column = d3.selectAll(".square")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        column
        .style("stroke", "black")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        image
        .attr("selected", "true")
    })
}


// Clear all data from the plot
function clear_data() {
    shown_data.forEach(function(pokemon) {
        var column = d3.selectAll(".square")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        column
        .style("stroke", "none")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.group === pokemon.group; });
        image
        .attr("selected", "false")
    })
    shown_data = []
    update(shown_data)   
}

// Updates the plot
function update(data) {
    
    //Sort descending
    data.sort(function(b, a) {
        return a.value[0].base_stat - b.value[0].base_stat;
    });

    // Update the X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .attr("font-size", "15");

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.value[0].base_stat }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
        .data(data)

        u
        .enter()
        .append("rect") 
        .merge(u) 
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d.value[0].base_stat); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value[0].base_stat); })
        .attr("fill", "#e95e39")
        .on("mouseover", function(event, d) { 
            const name = d.group
            const hp = d.value[0].base_stat
            tooltip
                .html(d.group + "<br>" + "hp: " + hp)
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
            tooltip
                .style("opacity", 0)
            d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        })
        

    // If less group in the new dataset, delete the ones not in use anymore
    u
    .exit()
    .remove()
}
