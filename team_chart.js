team_1 = ["", "", "", "", "", ""]
team_2 = ["", "", "", "", "", ""]

async function update_chart() {
    var features = ['hp', "attack", "defense", "special_attack", "special_defense", "speed"]
    team_1_data = {}
    team_2_data = {}

    for(var i = 0; i < 6; i++) {
        team_1_data[features[i]] = 0
        team_2_data[features[i]] = 0
        for(var j = 0; j < 6; j++) {
            if(team_1[j] != "") {
                var p =  await factory.get_pokemon(team_1[j])
                team_1_data[features[i]] += p[features[i]]
            }
            if(team_2[j] != "") {
                var p =  await factory.get_pokemon(team_2[j])
                team_2_data[features[i]] += p[features[i]]
            }
        }
    }

    //Same as above but capitalized without _ and with spaces
    var data = [
        [
            {axis:"HP",value:team_1_data["hp"]},
            {axis:"Attack",value:team_1_data["attack"]},
            {axis:"Defense",value:team_1_data["defense"]},
            {axis:"Special Attack",value:team_1_data["special_attack"]},
            {axis:"Special Defense",value:team_1_data["special_defense"]},
            {axis:"Speed",value:team_1_data["speed"]}
        ],[
            {axis:"HP",value:team_2_data["hp"]},
            {axis:"Attack",value:team_2_data["attack"]},
            {axis:"Defense",value:team_2_data["defense"]},
            {axis:"Special Attack",value:team_2_data["special_attack"]},
            {axis:"Special Defense",value:team_2_data["special_defense"]},
            {axis:"Speed",value:team_2_data["speed"]}
        ]
    ];

    
    var radarChartOptions = {
        w: 300,
        h: 300,
        margin: {
            top: 120,
            right: 120,
            bottom: 120,
            left: 120
        },
        maxValue: 500,
        levels: 5,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#EDC951", "#CC333F"]),
    };

    console.log(data)

    RadarChart(".team_chart", data, radarChartOptions);
}

async function update_teams() {
    for(var i = 0; i < 6; i++) {
        var element1 = document.getElementById("team_select_1_" + (i + 1))
        var element2 = document.getElementById("team_select_2_" + (i + 1))
        team_1[i] = element1.options[element1.selectedIndex].value
        team_2[i] = element2.options[element2.selectedIndex].value
    }
    await update_chart()
    // comparision (team1, team2)
}

factory = new PokemonFactory()

factory.get_pokemons().then(function(pokemons) {
    for(var i = 0; i < 6; i++) {
        var element = document.getElementById("team_select_1_" + (i + 1))
        element.addEventListener("change", update_teams)
        var element2 = document.getElementById("team_select_2_" + (i + 1))
        element2.addEventListener("change", update_teams)
        for(var j = 0; j < pokemons.length; j++) {
            var option = document.createElement("option")
            option.text = pokemons[j].name
            option.value = pokemons[j].name
            element.add(option)

            var option2 = document.createElement("option")
            option2.text = pokemons[j].name
            option2.value = pokemons[j].name
            element2.add(option2)
        }
    }
});

update_chart();
