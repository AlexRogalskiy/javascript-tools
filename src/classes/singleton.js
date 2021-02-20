var singleton = (function() {
	var privateVariable = 10;
	
	function privateFunction() {
		return false;
	};
	
	var obj = new Object();
	
	obj.publicProperty = true;
	obj.pulblicMethod = function() {
		privateVariable++;
		return privateFunction();
	};
	
	return obj;
})();