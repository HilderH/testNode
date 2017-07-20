function generateRandomCode(length){
	var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
	var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var character = "";
	var code = "";
	character += lowercaseLetters;
	character += uppercaseLetters;
	for(var i=0; i < length; i++){
		code += character.charAt(getRandomNumber(0, character.length));
	}
	function getRandomNumber(lowerBound,upperBound){ 
		random = Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
		return random;
	}
	return code;
}
//angular.module('app', ['ngMaterial']);