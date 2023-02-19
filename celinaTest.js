


async function retriveData(){
    var nameList = [];
    var HP_list = [];

    for(var i = 1; i <= 151; i++){
    
        const responseName = await fetch(" https://pokeapi.co/api/v2/pokemon/"+ i);
        const pokemon = await responseName.json();


        //console.log(pokemon.name);
        var tempName = JSON.stringify(pokemon.name).split("\"")[1];
        var tempHP = JSON.stringify(pokemon.stats[0]).split(",")[0];

        console.log(tempHP);
        
        nameList.push(tempName);
    }
}
/*
     const matrix = [data,nameList];

     var svg = d3.select("svg"),
         margin = 200,
         width = svg.attr("width") - margin,
         height = svg.attr("height") - margin;
 
     var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
         yScale = d3.scaleLinear().range ([height,0]);
    
     var g = svg.append("g").attr("transform","translate(" + 100 + "," + 100 + ")");

    xScale.domain(nameList);
    yScale.domain([0, d3.max(data)]);

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));


    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
    }).ticks(data.length));

    for (var i = 0; i < nameList.length ;i++){
        g.selectAll(".bar")
        .data(matrix)
        .enter().append("rect")
        .attr("x", xScale(nameList[i]))
        .attr("y", yScale(data[i]))
        .attr("width", xScale.bandwidth())
        .attr("height", height-yScale(data[i]))
        .attr("fill", "steelblue");        
    }
}
*/


function test(){
    retriveData();
}