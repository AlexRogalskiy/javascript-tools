jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.telehoneNumber = function(spec) {
	// 0 -> Q, 1 -> Z
	const PHONE_ALPHABET = {0: '0', 1: '1', 2: ['A', 'B', 'C'], 3: ['D', 'E', 'F'], 4: ['G', 'H', 'I'], 5: ['J', 'K', 'L'], 6: ['M', 'N', 'O'], 7: ['P', 'R', 'S'], 8: ['T', 'U', 'V'], 9: ['W', 'X', 'Y']};
	var PHONE_NUMBER_LENGTH = 7;
	var phoneNum = [];
	var result = [];
	//var that = {};
	var that = Object.create(jsar.utils.telehoneNumber.prototype);
	//that.prototype = jsar.utils.telehoneNumber;
	//
	var init = function() {
		if(!jsar.toolset.isNull(spec)) {
			if(!jsar.toolset.isObject(spec)) { throw {
												name: 'ValueError',
												message: 'incorrect initialization value: [object]'
											};
			}
			if(Object.prototype.hasOwnProperty.call(spec, 'phoneNumber') && jsar.toolset.isArray(spec.phoneNumber)) {
				if(!spec.phoneNumber.length) throw {name: 'ValueError', message: 'incorrect parameter: array length < ' + spec.phoneNumber.length + ' >'};
				PHONE_NUMBER_LENGTH = spec.phoneNumber.length;
				phoneNum = spec.phoneNumber;
				result = jsar.toolset.vector(PHONE_NUMBER_LENGTH);
			} else {
				var o = Object.create(Error.prototype, {name: 'ValueError', message: 'incorrect initialization values: {\'phoneNumber\': [positive integer numbers]'});
				throw o;
				//throw {
				//	name: 'ValueError',
				//	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'
				//};
			}
		}
	};
	var getCharKey = function(num, ind) {
		if(!jsar.toolset.isIntNumber(num)) { throw {
													name: 'ValueError',
													message: 'incorrect input value: phone number < ' + num + ' >'
												};
		}
		return PHONE_ALPHABET[num][ind-1];
	};
	that.printWords = function() {
		for(var i=0; i<PHONE_NUMBER_LENGTH; i++) {
			result[i] = getCharKey(phoneNum[i], 1);
		}
		while(true) {
			for(var i=0; i<PHONE_NUMBER_LENGTH; i++) {
				console.log(result[i]);
			}
			for(var i=PHONE_NUMBER_LENGTH-1; i>=-1; i--) {
				if(i == -1) {
					return;
					if(getCharKey(phoneNum[i], 3) == result[i] || phoneNum[i] == 0 || phoneNum[i] == 1) {
						result[i] = getCharKey(phoneNum[i], 1);
					} else if(getCharKey(phoneNum[i], 1) == result[i]) {
						result[i] = getCharKey(phoneNum[i], 2);
					} else if(getCharKey(phoneNum[i], 2) == result[i]) {
						result[i] = getCharKey(phoneNum[i], 3);
						break;
					}
				}
			}
		}
	};
	that.clone = function() {
		return jsar.utils.telehoneNumber({'phoneNumber': phoneNum});
	};
	/////////  [end] getter / setter methods [end] ///////
	init();
	return that;
};

//Minute counter
//jsar.utils.bucketCounter({'xnumOfBuckets': 1, 'secsPerBucket': 60});

//Hour counter
//jsar.utils.bucketCounter({'xnumOfBuckets': 60, 'secsPerBucket': 60});
-----------------------------------------------------------
