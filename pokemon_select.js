
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
const num_rows = 13;
const num_cols = 13;
//Data used for filtering
filter_data = []

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
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            id: pokemon.id,
            value: pokemon.stats,
            hp: pokemon.stats[0].base_stat,
            attack: pokemon.stats[1].base_stat,
            defense: pokemon.stats[2].base_stat,
            speed: pokemon.stats[5].base_stat,
            specialAttack: pokemon.stats[3].base_stat,
            img: pokemon.sprites.other.dream_world.front_default,
            sprite: pokemon.sprites.front_default,
            type: pokemon.types
        });
    })
    initgrid(num_rows, num_cols, pokemon_data, 151) 
    sessionStorage.setItem("pokemon_data", JSON.stringify(pokemon_data))
    update(shown_data, pokemon_data)
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
const tooltip = d3.select("#grid")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
.style("position", "absolute")
.style("user-select", "none")
.style("z-index", 5)
.style("font-size", "16px")

//CLICK-EVENT VARIABLES 
var image_mouseclick = function(event, d) { 
    //Click event for selecting a pokemon
    var column = d3.selectAll(".square")
    .filter(function(square) { return square.x === d.x && square.y == d.y; });
    
    //Transitions not working atm for some reason
    column
    .style("stroke", function() {
        return d3.select(this).style("stroke") === "none" ? "#555" : "none";
    })


    if(d3.select(this).attr("selected") === "false") {
        d3.select(this).attr("selected", "true")
        shown_data.push(d.pokemon)
    }
    else {
        d3.select(this).attr("selected", "false")
        //Delete the pokemon from the array 
        shown_data = shown_data.filter(function(pokemon) { return pokemon.name !== d.pokemon.name; })
    }
    update(shown_data)
}

var image_mouseover = function(event, d) { 
    tooltip
        .html("<b>" + d.pokemon.name + "</b>" + "<br>" + "Pokédex No. " + d.pokemon.id + "<br>" 
                + "Type: " + d.pokemon.type[0].type.name.charAt(0).toUpperCase() 
                + d.pokemon.type[0].type.name.substring(1)
                + (d.pokemon.type[1] ? "/" + d.pokemon.type[1].type.name.charAt(0).toUpperCase() + d.pokemon.type[1].type.name.substring(1) : "")
                + "<br>" + "HP: " + d.pokemon.hp 
                + "<br>" + "Attack: " + d.pokemon.attack 
                + "<br>" + "Defense: " + d.pokemon.defense 
                + "<br>" + "Speed: " + d.pokemon.speed 
                + "<br>" + "Special: " + d.pokemon.specialAttack
        )
        .style("opacity", 1)     
        .style("left", (event.pageX) + 5 + "px")
        .style("top", (event.pageY) - 80 + "px")
    d3.select(this).transition()
    .duration('50')
    .attr('opacity', '.75')
}

var image_mouseout = function (event, d) {
    tooltip
        .style("opacity", 0)
        .style("left", "0px")
        .style("top",  "0px")
    d3.select(this).transition()
    .duration('50')
    .attr('opacity', '1');
}

var image_mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
    .style("left", (event.pageX) + 5 + "px")
    .style("top", (event.pageY) - 80 + "px")
}

var general_mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY) - 30 + "px")
}


var sort_grid = d3.select("#sort_dropdown")
    .selectAll("img")
    .attr("selected", "false")
    .style("border", "none")
    .style("border-radius", "100%")
    .style("cursor", "pointer")
    .on("click", function() {
        var selected = d3.select(this).attr("selected")

        if (selected != "true") { 
            sort_grid.
            style("border", "none")
            .attr("selected", "false")

            d3.select(this)
            .style("border", "5px solid #555")
            .attr("selected", "true")
        }
    })
    .on("mouseover", function(event, d) {
        tooltip
        .html(d3.select(this).attr("name"))
        .style("opacity", 1)     
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) - 30 + "px")
        
        d3.select(this)
        .style("filter", "drop-shadow(3px 3px 3px rgb(0 0 0 / 0.4)")
    })
    .on("mouseout", function(event, d) {
        tooltip
        .style("opacity", 0)
        .style("left", "0px")
        .style("top",  "0px")

        d3.select(this)
        .style("filter", "none")
    })
    .on("mousemove", general_mousemove)

d3.select("#sort_dropdown")
.selectAll("img")
.filter(function () {
    return d3.select(this).attr("name") === "Pokédex ID"
})
.attr("selected", "true")
.style("border", "5px solid #555")




function filter_type() {
    types = ["Bug", "Dragon", "Electric", "Fighting", "Fire", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Water"]

    var filter_div = d3.select("#filter").attr("selected-type", "none")
    for(let i = 0; i < types.length; i++) {
        filter_div.append("img")
        .attr("src", `assets/filter_icons/Pokemon_Type_Icon_${types[i]}.svg`)
        .attr("class", "filter_icon")
        .attr("type", types[i])
        .attr("width", "50px")
        // .style("border", "5px solid #555")
        .style("border-radius", "100%")
        .style("border", "none")
        .style("cursor", "pointer")
        .on("click", function() {
            var type = d3.select(this).attr("type")
            var selected = d3.select(this).style("border")

            if(selected == "5px solid rgb(85, 85, 85)") {
                filter_div.attr("selected-type", "none")
                //Remove the filter
                d3.select(this)
                .style("border", "none")

                //Turn the opacity down in the grid div for the pokémon that are not filtered out 
                d3.selectAll(".image")
                .filter((square) => {
                    return square.pokemon.type[0].type.name.toLowerCase() !== type.toLowerCase()
                })
                .attr("opacity", 1)
                .on("click", image_mouseclick)
                .on("mouseover", image_mouseover)
                .on("mousemove", image_mousemove)
                .on("mouseout", image_mouseout)
                .style("cursor", "pointer")

            } else {
                //Add the filter

                //Only allow one filter at a time
                d3.selectAll(".filter_icon").style("border", "none")
                d3.selectAll(".image")
                .attr("opacity", 1)
                .on("click", image_mouseclick)
                .on("mouseover", image_mouseover)
                .on("mousemove", image_mousemove)
                .on("mouseout", image_mouseout)
                .style("cursor", "pointer")
                
                filter_div.attr("selected-type", type)

                d3.select(this).style("border", "5px solid #555")
                d3.selectAll(".image")
                .filter((square) => {
                    return square.pokemon.type[0].type.name.toLowerCase() !== type.toLowerCase()
                })
                .attr("opacity", 0.10)
                .on("click", null)
                .on("mouseover", null)
                .on("mousemove", null)
                .on("mouseout", null)
                .style("cursor", "default")

            }
        })
        .on("mouseover", function(event, d) {
        //Show tooltip with type
            tooltip
            .style("opacity", 1)
            .html(d3.select(this).attr("type"))  
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) - 30 + "px")

            d3.select(this)
            .style("filter", "drop-shadow(3px 3px 3px rgb(0 0 0 / 0.4)")
        })
        .on("mousemove", general_mousemove)
        .on("mouseout", function (event, d) {
            border = d3.select(this).style("border")

            tooltip
                .style("opacity", 0)
                .style("left", "0px")
                .style("top",  "0px")

            d3.select(this)
            .style("filter", "none")
        })
    }


}

//Function for initializing the grid
function initgrid(num_rows, num_cols, pokemon_data, limit) {

    var xpos = 1; 
    var ypos = 1; 
    var width = 60; 
    var height = 60;
    var x_offset = 6;
    var y_offset = 6; 
    
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
    .style("stroke-width", "2px")
    .style("stroke", "none")
    .style("rx", "8px")
    .style("ry", "8px")
    .style("filter", "drop-shadow(2px 2px 2px rgb(0 0 0 / 0.4)")

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
    .style("cursor", "pointer")
    .on("click", image_mouseclick)
    .on("mouseover", image_mouseover)
    .on("mousemove", image_mousemove)
    .on('mouseout', image_mouseout)
    images.exit().remove()
}

function update_grid(sortBy) {
    //If the grid is already sorted by sortBy, exit function
    if(sortBy == d3.select("#grid").attr("sort_order"))
        return; 
    

    //Sort the pokemon_data array by the sortBy parameter
    pokemon_data.sort(function(b, a) {
        switch(sortBy) {
            case 0: return b.id - a.id; 
            case 1: return a.value[0].base_stat - b.value[0].base_stat; 
            case 2: return a.value[1].base_stat - b.value[1].base_stat;
            case 3: return a.value[2].base_stat - b.value[2].base_stat;
            case 4: return a.value[5].base_stat - b.value[5].base_stat;
            case 5: return a.value[3].base_stat - b.value[3].base_stat;
            default: break; 
        }
    });

    //Set the grid attribute to the sortBy parameter
    d3.select("#grid").attr("sort_order", sortBy);

    //Remove previous selections
    shown_data.forEach(function(pokemon) {
        var column = d3.selectAll(".square")
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
        column
        .style("stroke", "none")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
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
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
        column
        .style("stroke", "#555")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
        image
        .attr("selected", "true")

    })

    //Ensure that filters move with the grid
    d3.select("#grid")
    .selectAll(".image")
    .attr("opacity", 1)
    .on("click", image_mouseclick)
    .on("mouseover", image_mouseover)
    .on("mousemove", image_mousemove)
    .on("mouseout", image_mouseout)

    var type = d3.select("#filter").attr("selected-type")
    if(type !== "none") {
        d3.select("#grid").selectAll(".image")
        .filter(function(square) {
            return square.pokemon.type[0].type.name.toLowerCase() !== type.toLowerCase()
        })
        .attr("opacity", 0.10)
        .on("click", null)
        .on("mouseover", null)
        .on("mousemove", null)
        .on("mouseout", null)
    }

}

// Clear all data from the plot
function clear_data() {
    shown_data.forEach(function(pokemon) {
        var column = d3.selectAll(".square")
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
        column
        .style("stroke", "none")
        
        var image = d3.selectAll(".image")
        .filter(function(square) { return square.pokemon.name === pokemon.name; });
        image
        .attr("selected", "false")
    })
    shown_data = []
    update(shown_data)   
}

filter_type()