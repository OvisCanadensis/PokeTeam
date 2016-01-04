// ------------------------
// Setting up the variables
// ------------------------

// Variables to store the data from CSV's
var pokeNames;
var pokeTypes;
var pokeAbilities;

//CSV Index References
const POKEMON_ID = 0;
const POKEMON_NAME = 1;
const POKEMON_TYPE = 1;

var dataCounter = 0;
const NUMBER_OF_FILES_TO_LOAD = 3;

// -----------------------
// Onwards
// -----------------------

$(document).ready(function(){
	console.log(nameToID("Mega Charizard"));
});

// Don't launch .ready function until directed
$.holdReady(true);

// Which is when all of the .CSV's have finished loading
function delayStart(){
	//Launch only at the final file
	if (dataCounter == NUMBER_OF_FILES_TO_LOAD - 1)
			$.holdReady(false);
	else if (dataCounter < NUMBER_OF_FILES_TO_LOAD)
		dataCounter++;
}

// Download the pokemon names into 2D array
Papa.parse("https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/csv/pokemon.csv", {
	download: true,
	// header: true, // this could allow identification of column by name instead of index
					 // but this would introduce off by one errors that are eliminated by
					 // the use of the header column

	complete: function(results) {
		pokeNames = results.data;
		delayStart();
	}
});

//Download the pokemon types into 2D array
Papa.parse("https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/csv/pokemon_types.csv", {
	download: true,
	complete: function(results) {
		pokeTypes = results.data;
		delayStart();
	}
});

//Download the pokemon abilities into 2D array
Papa.parse("https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/csv/pokemon_abilities.csv", {
	download: true,
	complete: function(results) {
		pokeAbilities = results.data;
		delayStart();
	}
});

// -----------------------
// Pokemon Class
// -----------------------

function Pokemon(number){
	var number = number;
	this.getID = function() { return number; };
	if (number < 1 )
		throw "negative pokemon ID";
	
	var pokeName = pokeNames[number][POKEMON_NAME];
	this.getName = function() { return pokeName; };
	
	var type1 = findType1(number);
	this.getType1 = function() { return type1; }

	//If not dual type, this is null;
	var type2 = findType2(number);
	this.getType2 = function() { return type2; }

	//Must decide how to implement abilties
	// Multiple and hidden abilities etc.

	//Search the pokeTypes array for the type1 of pokemon with id number
	//REQUIRES OPTIMIZATION
	function findType1(number) {
		for (i = 1; i < pokeTypes.length; i++) {
			if ( pokeTypes[i][POKEMON_ID] == number) {
				return pokeTypes[i][POKEMON_TYPE];
			}
		}
		throw "No primary type for pokemon #" + number;
	}

	//Search the pokeTypes array for the type1 of pokemon with id number
	//REQUIRES OPTIMIZATION
	function findType2( number ) {
		for (i = 1; i < pokeTypes.length; i++) {
			if ( pokeTypes[i][POKEMON_ID] == number) {
				//If not the last one, check if the next row has the same pokemon
				if ( i != pokeTypes.length - 1 && pokeTypes[i+1][POKEMON_ID] == number)
					return pokeTypes[i+1][POKEMON_TYPE];
				else
					return null;
			}
		}
		throw "Error finding type2. Loop should never actually exit. Invalid pokemon#?";
	}
}

// This doesn't seem to be working?
Pokemon.prototype.toString = function pokemonToString() {
    return this.pokeName;
}

function nameToID( name ){
	if ( typeof name != typeof "random_string")
		throw "Pokemon name not a string?";

	if ( isNotAlpha(name))
		throw "Pokemon names are only letters. Unless stupid nidoran";

	for (var i = 1; i < pokeNames.length; i++) {
		if (pokeNames[i][POKEMON_NAME] == name.toLowerCase())
			return pokeNames[i][POKEMON_ID];
	}

	return -1;
}

function isNotAlpha(name) {
    return /[^a-zA-Z]/.test(name)
}