async function get_pokemons_from_api() {
    var response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + 151 + "&offset=0")
    var response_json = await response.json()
    return response_json.results
}

async function get_pokemon_species_from_api(pokemon_name) {
    var response = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemon_name)
    var response_json = await response.json()
    return response_json
}

async function get_pokemon_from_api(pokemon_name) {
    var response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon_name)
    var response_json = await response.json()
    return response_json
    
}

// Class that stores a Pokemon with name, image, type, hp, attack, defense, sp_attack, sp_defense, and speed
class Pokemon {
    constructor(name, image, type, hp, attack, defense, special_attack, special_defense, speed) {
        this.name = name
        this.image = image
        this.type = type
        this.hp = hp
        this.attack = attack
        this.defense = defense
        this.special_attack = special_attack
        this.special_defense = special_defense
        this.speed = speed
    }
}

class PokemonFactory {
    constructor() {
    }

    // Get a single pokemon from the API and store it in session storage
    // Returns a Pokemon object
    async get_pokemon(pokemon_name) {
        if(sessionStorage.getItem(pokemon_name) != null) {
            var pokemon = JSON.parse(sessionStorage.getItem(pokemon_name))
            //console.log("Getting pokemon " + pokemon_name + " from session storage")
            return pokemon
        } else {
            var pokemon_data = await get_pokemon_from_api(pokemon_name)
            var image = await pokemon_data.sprites.front_default
            var type = await pokemon_data.types[0].type.name
            var stats = await pokemon_data.stats
            var hp = await stats[0].base_stat
            var attack = await stats[1].base_stat
            var defense = await stats[2].base_stat
            var special_attack = await stats[3].base_stat
            var special_defense = await stats[4].base_stat  
            var speed = await stats[5].base_stat
            var pokemon = new Pokemon(pokemon_name, image, type, hp, attack, defense, special_attack, special_defense, speed)
            sessionStorage.setItem(pokemon_name, JSON.stringify(pokemon))
            return pokemon
        }
    }

    // Get all 151 pokemons from the API and store them in session storage
    // Returns an array of Pokemon objects with all Pokemons
    async get_pokemons() {
        if(sessionStorage.getItem("pokemons") != null && sessionStorage.getItem("pokemons") != "[]") {
            var pokemons = JSON.parse(sessionStorage.getItem("pokemons"))
            console.log("Getting pokemons from session storage")
            return pokemons
        } else {
            var pokemons = []
            var pokemon_names = await get_pokemons_from_api()
            for(var i = 0; i < pokemon_names.length; i++) {
                var pokemon = await this.get_pokemon(pokemon_names[i].name)
                pokemons.push(pokemon)
            }
            sessionStorage.setItem("pokemons", JSON.stringify(pokemons))
            return pokemons
        }
    }
}