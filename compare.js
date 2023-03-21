var pokemon1;
var pokemon2;
var type1;
var type2;

async function compare(){
    var dmg;  
    graph = {nodes:[], links:[]}
    nodes = []
    links = []
    fighting_list = []

    //all pokemon in team 1 attacking all pokemon in team 2
   
    for(var i = 0; i < 6; i++){
        for(var j = 0; j < 6; j++){

            //4graph.links = push({source: i, target: j+6})
            links.push({source: i, target: j+6});
           
            

            dmg = await compareType(team_1[i], team_2[j]);
           
            //fighting_list.push(new fight(p1,p2,dmg));
            if( dmg == 0){
                //console.log(team_1[i], " Deals no dmg to " ,team_2[j])
            }
            else if(dmg < 1){
                //console.log(team_1[i], " Are weak against " ,team_2[j])
            }
            else if(dmg > 1){
                //console.log(team_1[i], " Are strong against " ,team_2[j])
            } else{
                //console.log(team_1[i], " Are neutral against " ,team_2[j])
            }
        
        }
        p1 = await factory.get_pokemon(team_1[i])
        p2 = await factory.get_pokemon(team_2[i])

        //graph.nodes = push({name: team_1[i],id: i})
        //graph.nodes = push({name: team_2[i],id: i+6})
        nodes.push({name: p1.name,id: i, image: p1.image});
        nodes.push({name: p2.name, id: i+6, image: p2.image});
    }
   
    return nodes,links;
}


async function createGraph(){
    var graph1 = {
        nodes,
        links
    }
    
    /*
    var graph2 = {
        nodes: [
          { name: "Alice" },
          { name: "Bob" },
          { name: "Chen" },
          { name: "Dawg" },
          { name: "Ethan" },
          { name: "George" },
          { name: "Frank" },
          { name: "Hanes" }
        ],
        links: [
          { source: "Alice", target: "Bob" },
          { source: "Chen", target: "Bob" },
          { source: "Dawg", target: "Chen" },
          { source: "Hanes", target: "Frank" },
          { source: "Hanes", target: "George" },
          { source: "Dawg", target: "Ethan" }
        ]
      };*/

    console.log(graph1.nodes) 
    //console.log(graph2)   

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#compare")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var link = svg
        .append("g")
        .attr("class","links")
        .selectAll("line")
        .data(graph1.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d){return 3;})
        .style("stroke", "#aaa");

    var node = svg
        .append("g")
        .attr("class","nodes")
        .selectAll("circle")
        .data(graph1.nodes)
        .enter()
        .append("circle")
            .attr("r",10)
            .style("fill", "#69b3a2")
            //.html(function (d) { return "<img id = \"pokemon_img\" src="+ d.image +">"; })
    var simulation = d3.forceSimulation(graph1.nodes)
        .force("link", d3.forceLink()
            .id(function(d) {
                return d.id;
            })
            .links(graph1.links))
        .force("change", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width/2, height/2))
        .on("tick",ticked);

    function ticked(){
        link
            .attr("x1", function(d){return d.source.x;})
            .attr("y1", function(d){return d.source.y;})
            .attr("x2", function(d){return d.target.x;})
            .attr("y2", function(d){return d.target.y;});

        node    
            .attr("cx", function(d){return d.x;})
            .attr("cy", function(d){return d.y;});
    }
    //console.log(graph)
}

async function showList(){
    //nodes, links = await compare();
    
    var table = d3.select("table").selectAll("*").remove();
    var switchTeam = d3.select(".center").selectAll("#switchBtn.button").remove();
    var table2 = d3.select("table2").selectAll("*").remove();
    var h1 = d3.select("#compare").selectAll("h1").remove();
    var switchTeam = d3.select(".center").append("button").attr("id","switchBtn")
        .attr("class","button")
        .on("click", function(){
            var temp = team_1
            team_1 = team_2
            team_2 = temp
            showList()
        })
        .html("switch Attacking team!");
    //var table = d3.select("#compare").append("table");
    table = await d3.select("table").html("<th class = 'th1'>Attacking</th><th class = 'th2'>Defending</th>")
    for(var i = 0; i< 6 ;i ++){
        try {
            pokemon1 = await factory.get_pokemon(team_1[i]);
            pokemon2 = await factory.get_pokemon(team_2[i]);
            var attack ="";
            var dmg = await compareType(team_1[i], team_2[i]);
            type1 = pokemon1.type;
            type2 = pokemon2.type;
           
            if( dmg == 0){
                attack = team_1[i] + " ["+ type1+"] "+ " deals no dmg to " + team_2[i] +" ["+ type2 +"]";
            }
            else if(dmg < 1){
                attack = team_1[i] + " ["+ type1+"] "+" is weak against " + team_2[i] +" ["+ type2 +"]";
            }
            else if(dmg > 1){
                attack = team_1[i] +" ["+ type1+"] "+ " is strong against " + team_2[i]+" ["+ type2 +"]";
                
            } else{
                attack = team_1[i] +" ["+ type1+"] "+ " is neutral against " + team_2[i] +" ["+ type2 +"]";
            }
            table = await d3.select("table").append("tr");

            table = await d3.select("table")
                .append("td").style("float","left")
                .append("button").attr("id",pokemon1.name).on("click", function(){fightAll(this.id)}).html("<img id = 'pokemon_img' src = " + pokemon1.image +"></img>");
            
            table = await d3.select("table").append("td").style("float","left").append("f").html(attack);
            table = await d3.select("table")
                .append("td").append("button").attr("disabled",true)
                .html("<img id = 'pokemon_img' src = " + pokemon2.image +"></img>");

        } catch (error) {
            div = d3.select("#compare").append("h1").html("Select both teams fully");
            break
        }
    }
    //console.log(nodes)
    //console.log(links)
    //createGraph();
}

class fight{
    constructor(attacking, deffending, power){
        this.attacking = attacking;
        this.deffending = deffending;
        this.power = power; 
    }
}

async function fightAll(name){
    try {
        var table = d3.select("table").selectAll("*").remove();
        var table2 = d3.select("table2").selectAll("*").remove();
        //var table2 = d3.select("#compare").append("table2").attr("class",table);
        console.log(name);
        for(var i = 0; i < 6 ; i++){
            
            pokemon2 = await factory.get_pokemon(team_2[i]);
            
            pokemon1 = await factory.get_pokemon(name);
            var dmg = await compareType(pokemon1.name, pokemon2.name);

            var type1 = pokemon1.type;
            var type2 = pokemon2.type;

            if( dmg == 0){
                attack = pokemon1.name + " ["+ type1+"] "+ " deals no dmg to " + pokemon2.name +" ["+ type2 +"]";
            }
            else if(dmg < 1){
                attack = pokemon1.name + " ["+ type1+"] "+" is weak against " + pokemon2.name +" ["+ type2 +"]";
            }
            else if(dmg > 1){
                attack = pokemon1.name +" ["+ type1+"] "+ " is strong against " + pokemon2.name+" ["+ type2 +"]";
                
            } else{
                attack = pokemon1.name +" ["+ type1+"] "+ " is neutral against " + pokemon2.name +" ["+ type2 +"]";
            }

            table2 = d3.select("table2").append("tr").html("<td><img id = 'pokemon_img' src = " + pokemon1.image +"></img></td><td>"+attack+"</td><td><img id = 'pokemon_img' src = "+ pokemon2.image+"></img></td>");
        
        }

        table2 = d3.select("table2").append("div").attr("class","center").html("<button class='button' onclick='showList()'>Back</button>");
    } catch (error) {
        console.log(error)
    }
    
}

async function compareType(attack, defense){
    attack = await factory.get_pokemon(attack);
    defense = await factory.get_pokemon(defense); 
    attack = attack.type;
    defense = defense.type;

    if (attack == "normal"){
        if(defense == "rock") return 0.5;
        else if(defense == "ghost") return 0;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "fire"){
        if(defense == "fire") return 0.5;
        else if(defense == "water") return 0.5;
        else if(defense == "grass") return 2;
        else if(defense == "ice") return 2;
        else if(defense == "bug") return 2;
        else if(defense == "rock") return 0.5;
        else if(defense == "dragon") return 0.5;
        else if(defense == "steel") return 2;
        else return 1;
    }

    if(attack == "water"){
        if(defense == "fire") return 2;
        else if(defense == "water") return 0.5;
        else if(defense == "grass") return 0.5;
        else if(defense == "ground") return 2;
        else if(defense == "rock") return 2;
        else if(defense == "dragon") return 0.5;
        else return 1;
    }

    if(attack == "grass"){
        if(defense == "fire") return 0.5;
        else if(defense == "water") return 2;
        else if(defense == "grass") return 0.5;
        else if(defense == "poison") return 0.5;
        else if(defense == "ground") return 2;
        else if(defense == "flying") return 0.5;
        else if(defense == "bug") return 0.5;
        else if(defense == "rock") return 2;
        else if(defense == "dragon") return 0.5;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "electric"){
        if(defense == "water") return 2;
        else if(defense == "grass") return 0.5;
        else if(defense == "electric") return 0.5;
        else if(defense == "ground") return 0;
        else if(defense == "flying") return 2;
        else if(defense == "dragon") return 0.5;
        else return 1;
    }

    if(attack == "ice"){
        if(defense == "fire") return 0.5;
        else if(defense == "water") return 0.5;
        else if(defense == "grass") return 2;
        else if(defense == "ice") return 0.5;
        else if(defense == "ground") return 2;
        else if(defense == "flying") return 2;
        else if(defense == "dragon") return 2;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "fighting"){
        if(defense == "normal") return 2;
        else if(defense == "ice") return 2;
        else if(defense == "poison") return 0.5;
        else if(defense == "flying") return 0.5;
        else if(defense == "psychic") return 0.5;
        else if(defense == "bug") return 0.5;
        else if(defense == "rock") return 2;
        else if(defense == "ghost") return 0;
        else if(defense == "dark") return 2;
        else if(defense == "steel") return 2;
        else if(defense == "fairy") return 0.5;
        else return 1;
    }

    if(attack == "poison"){
        if(defense == "grass") return 2;
        else if(defense == "poison") return 0.5;
        else if(defense == "ground") return 0.5;
        else if(defense == "rock") return 0.5;
        else if(defense == "ghost") return 0.5;
        else if(defense == "steel") return 0;
        else if(defense == "fairy") return 2;
        else return 1;
    }

    if(attack == "ground"){
        if(defense == "fire") return 2;
        else if(defense == "grass") return 0.5;
        else if(defense == "electric") return 2;
        else if(defense == "poison") return 2;
        else if(defense == "flying") return 0;
        else if(defense == "bug") return 0.5;
        else if(defense == "rock") return 2;
        else if(defense == "steel") return 2;
        else return 1;
    }

    if(attack == "flying"){
        if(defense == "grass") return 2;
        else if(defense == "electric") return 0.5;
        else if(defense == "fighting") return 2;
        else if(defense == "bug") return 2;
        else if(defense == "rock") return 0.5;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "psychic"){
        if(defense == "fighting") return 2;
        else if(defense == "poison") return 2;
        else if(defense == "psychic") return 0.5;
        else if(defense == "dark") return 0;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "bug"){
        if(defense == "fire") return 0.5;
        else if(defense == "grass") return 2;
        else if(defense == "fighting") return 0.5;
        else if(defense == "poison") return 0.5;
        else if(defense == "flying") return 0.5;
        else if(defense == "psychic") return 2;
        else if(defense == "ghost") return 0.5;
        else if(defense == "dark") return 2;
        else if(defense == "steel") return 0.5;
        else if(defense == "fairy") return 0.5;
        else return 1;
    }

    if(attack == "rock"){
        if(defense == "fire") return 2;
        else if(defense == "ice") return 2;
        else if(defense == "fighting") return 0.5;
        else if(defense == "ground") return 0.5;
        else if(defense == "flying") return 2;
        else if(defense == "bug") return 2;
        else if(defense == "steel") return 0.5;
        else return 1;
    }

    if(attack == "ghost"){
        if(defense == "normal") return 0;
        else if(defense == "psychic") return 2;
        else if(defense == "ghost") return 2;
        else if(defense == "dark") return 0.5;
        else return 1;
    }

    if(attack == "dragon"){
        if(defense == "dragon") return 2;
        else if(defense == "steel") return 0.5;
        else if(defense == "fairy") return 0;
        else return 1;
    }

    if(attack == "dark"){
        if(defense == "fighting") return 0.5;
        else if(defense == "psychic") return 2;
        else if(defense == "ghost") return 2;
        else if(defense == "dark") return 0.5;
        else if(defense == "fairy") return 0.5;
        else return 1;
    }

    if(attack == "steel"){
        if(defense == "fire") return 0.5;
        else if(defense == "water") return 0.5;
        else if(defense == "electric") return 0.5;
        else if(defense == "ice") return 2;
        else if(defense == "rock") return 2;
        else if(defense == "steel") return 0.5;
        else if(defense == "fairy") return 2;
        else return 1;
    }

    if(attack == "fairy"){
        if(defense == "fire") return 0.5;
        else if(defense == "fighting") return 2;
        else if(defense == "poison") return 0.5;
        else if(defense == "dragon") return 2;
        else if(defense == "dark") return 2;
        else if(defense == "steel") return 0.5;
        else return 1;
    }
}