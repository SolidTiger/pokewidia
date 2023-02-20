function main(){
    retriveData();
}

var pokeInfo =[
    ["name", "Type", "HP"]
];

async function retriveData(type){
    var xData = [];
    var yData = [];
    var types = ["Grass","Poison","Fire","Flying","Water","Bug","Normal","Electric","Ground","Fairy","Fighting","Psychic","Rock","Steel","Ice","Ghost","Dragon"];
    

//Fetching data and storing data
    for(var i = 1; i <= 151; i++){
    
        const responseName = await fetch(" https://pokeapi.co/api/v2/pokemon/"+ i);
        const pokemon = await responseName.json();

        var tempName = JSON.stringify(pokemon.name).split("\"")[1];
        var tempHP = parseInt(JSON.stringify(pokemon.stats[0]).split(",")[0].split(":")[1]);
        var tempType = JSON.stringify(pokemon.types).split("name")[1].split(",")[0].split("\"")[2];

        //console.log(tempType);
        yData.push(tempHP);
        xData.push(tempName);

        var tempInfo = [tempName,tempType, tempHP];
        pokeInfo.push(tempInfo); 
        
    }
    sortData("grass");
}

// Building bar chart
function buildChart(yData,xData){
    const matrix = [yData,xData];
    
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 1000 - margin.left - margin.right;
        height = 750  - margin.top - margin.bottom;


    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4);
    xScale.domain(xData);

    svg.append("g")
        .attr("transform", "translate(0," + height  + ")")
        .call(d3.axisBottom(xScale))     
        .selectAll("text")
            .attr("transform","translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    var yScale = d3.scaleLinear().range ([height,0]);
 
   
    yScale.domain([0, d3.max(yData)]);

    svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
    }).ticks(d3.max(yData)/10));

    for (var i = 0; i < xData.length ;i++){
        svg.selectAll(".bar")
        .data(matrix)
        .enter().append("rect")
        .attr("x", xScale(xData[i]))
        .attr("y", yScale(yData[i]))
        .attr("width", xScale.bandwidth())
        .attr("height", height-yScale(yData[i]))
        .attr("fill", "steelblue")
        ;        
    }
}

function sortData(type){
    try{
        var svg = d3.select("svg").remove();
        svg.selectAll("*").remove();
    }catch(e){

    }
    var xData = [];
    var yData = [];
    //console.log(pokeInfo);
    for(var i = 1; i<152;i++){
        if(pokeInfo[i][1] == type){

            xData.push(pokeInfo[i][0]);
            yData.push(pokeInfo[i][2]);
        }
    }
    buildChart(yData,xData);
}

