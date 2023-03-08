async function compare(){
    var factory = new PokemonFactory();

    var a = await factory.get_pokemon("bulbasaur");
    var b = await factory.get_pokemon("pikachu");
    var c = await factory.get_pokemon("squirtle");
    var d = await factory.get_pokemon("charmander");
    var e = await factory.get_pokemon("gastly");
    var f = await factory.get_pokemon("pidgey");

    var p1 =[a,b,c];
    var p2 = [d,e,f];

    console.log(a.type);
}

async function retriveData(pokemon_name){
//Fetching data and storing data

    
    const responseName = await fetch(" https://pokeapi.co/api/v2/pokemon/"+ pokemon_name);
    const pokemon = await responseName.json();

    var tempName = JSON.stringify(pokemon.name).split("\"")[1];
    var tempHP = parseInt(JSON.stringify(pokemon.stats[0]).split(",")[0].split(":")[1]);
    var tempType = JSON.stringify(pokemon.types).split("name")[1].split(",")[0].split("\"")[2];

    return pokeType;
 
}

function compareType(attack, defense){
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