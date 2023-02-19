function main(){
    retriveData();
}

async function retriveData(){
    var nameList = [];
    var HP_list = [];

//Fetching data and storing data
    for(var i = 1; i <= 151; i++){
    
        const responseName = await fetch(" https://pokeapi.co/api/v2/pokemon/"+ i);
        const pokemon = await responseName.json();

        var tempName = JSON.stringify(pokemon.name).split("\"")[1];
        var tempHP = parseInt(JSON.stringify(pokemon.stats[0]).split(",")[0].split(":")[1]);

        HP_list.push(tempHP);
        nameList.push(tempName);
    }
    buildChart(HP_list,nameList);
}

// Building bar chart
function buildChart(HP_list,nameList){
    const matrix = [HP_list,nameList];
    
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 1700 - margin.left - margin.right;
        height = 1000  - margin.top - margin.bottom;


    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4);
    xScale.domain(nameList);

    svg.append("g")
        .attr("transform", "translate(0," + height  + ")")
        .call(d3.axisBottom(xScale))     
        .selectAll("text")
            .attr("transform","translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    var yScale = d3.scaleLinear().range ([height,0]);
 
   
    yScale.domain([0, d3.max(HP_list)]);

    svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
    }).ticks(d3.max(HP_list)/10));

    for (var i = 0; i < nameList.length ;i++){
        svg.selectAll(".bar")
        .data(matrix)
        .enter().append("rect")
        .attr("x", xScale(nameList[i]))
        .attr("y", yScale(HP_list[i]))
        .attr("width", xScale.bandwidth())
        .attr("height", height-yScale(HP_list[i]))
        .attr("fill", "steelblue")
        ;        
    }
}

