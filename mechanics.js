// ------------------------
// Setting up the variables
// ------------------------

// Variables to store the data from CSV's
var pokeNames;
var pokeTypes;
var pokeAbilities;
var pokeTypeEfficacy;

//CSV Index References
const POKEMON_ID = 0;
const POKEMON_NAME = 1;
const POKEMON_TYPE = 1;

var dataCounter = 0;
const NUMBER_OF_FILES_TO_LOAD = 4;

const POKEMON_TYPE_NAMES= [ "normal", "fighting", "flying", "poison", "ground", "rock", "bug",
"ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy", "unknown", "shadow"];

function typeConverter( type){
	result = POKEMON_TYPE_NAMES.indexOf(type) + 1;
	if ( result < 1 )
		throw "Invalid Pokmeon Type: " + type;
	return result;
}
// -----------------------
// Onwards
// -----------------------

$(document).ready(function(){
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

Papa.parse("https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/csv/type_efficacy.csv", {
	download: true,

	complete: function(results) {
		pokeTypeEfficacy = results.data;
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

function typeEfficacy ( offense, defense){
	if ( offense > 18 || offense < 1 )
		throw "Invalid offense type: " + offense;

	if ( defense > 18 || defense < 1 )
		throw "Invalid defense type: " + defense;

	for ( i = 0; i < pokeTypeEfficacy.length; i++)
	{
		if ( pokeTypeEfficacy[i][0] == offense && pokeTypeEfficacy[i][1] == defense )
			return pokeTypeEfficacy[i][2];
	}

	throw "This should never happen";
}


//Returns the row index of the pokemon
//Thus ID's > 10,000 are reduced to circa 800
function nameToID( name ){
	if ( typeof name != typeof "random_string")
		throw "Pokemon name not a string?";

	// if ( name.indexOf(' ') > 0)
	// {
	// 	console.log(name.replace(' ', '-'));
	// 	return nameToID(name.replace(' ', '-'));
	// }

	if ( isNotAlpha(name))
		throw "Pokemon names are only letters. Unless stupid nidoran: " + name;

	for (var i = 1; i < pokeNames.length; i++) {
		if (pokeNames[i][POKEMON_NAME] == name.toLowerCase())
			return i;
	}
	return -1;
}

//Checks if the string is only letters
function isNotAlpha(name) {
	alphabet = "abcdefghijklmnopqrstuvwxyz";
	uppercase = alphabet.toUpperCase();

	for (i = 0; i < name.length; i++)
	{
		letter = name[i];
		if ( alphabet.indexOf(letter) < 0 && uppercase.indexOf(letter) < 0 )
		{
			return true;
		}
	}
	return false;
}