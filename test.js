$(document).ready(function(){
	alphabetTest();
	nameToIDTest();
	pokemonClassTest();
	typeEfficacyTest();
});

function pokemonClassTest(){
	b = new Pokemon(1);

	assert(b.getName() == "bulbasaur", "bulbasaur bulbasaur");
	assert(b.getID() == 1, "bulbasaur 1");
	assert(b.getType1() == 12, "bulbasaur grass");
	assert(b.getType2() == 4, "bulbasaur poison");
}

function alphabetTest(){

	function alterTest( name ){
		result = isNotAlpha(name);
		console.log(name + " " + result.toString());
	}

	assert( isNotAlpha("abc") == false, "abc");
	assert( isNotAlpha("sdf2") == true, "sdf2");
	assert( isNotAlpha("asdf asdf") == true, "asdf asdf");
	assert( isNotAlpha("asdf-asdf") == true, "asdf-asdf");
	assert( isNotAlpha("Mega Charizard") == true, "Megacharizard");
	assert( isNotAlpha("Mega Charizard2") == true, "Mega Charizard2");
	assert( isNotAlpha("Met@two") == true, "Met@two");
}

function nameToIDTest(){
	assert( nameToID("Bulbasaur") == 1, "Bulbasaur");
	assert( nameToID("torchic") == 255, "torchi");
}

function typeEfficacyTest(){
	assert(typeConverter("normal") == 1, "normal");
	assert(typeConverter("ground") == 5, "ground");
	assert(typeConverter("shadow") == 20, "shadow");
	assert(typeEfficacy(typeConverter("water"), typeConverter("rock")), 200);
	assert(typeEfficacy(typeConverter("ground"), typeConverter("flying"), 0));
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}