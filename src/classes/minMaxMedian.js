jsar.utils.minMaxMedian = function(spec) {
	var maxH = jsar.collections.maxHeap();
	var minH = jsar.collections.minHeap();
	//var that = {};
	var that = Object.create(jsar.utils.minMaxMedian);
	that.prototype = jsar.utils.minMaxMedian;
	//
	var init = function() {
		if(!jsar.toolset.isNull(spec)) {
			if(!jsar.toolset.isArray(spec)) { throw {
												name: 'ValueError',
												message: 'incorrect initialization value: array of elemens [any type]'
											};
			}
			for(var i=0; i<spec.length; i++) {
				that.addNewNumber(spec[i]);//data.push(element);
			}
		}
	};
	that.addNewNumber = function (randNum) {
		if(!jsar.toolset.isNumber(randNum)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: random number < ' + randNum + ' >'
											};
		}
		if(maxH.size() == minH.size()) {
			if((minH.peek() != null) && (randNum > minH.peek())) {
				maxH.insert(minH.poll());
				minH.insert(randNum);
			} else {
				maxH.insert(randNum);
			}
		} else {
			if(randNum < maxH.peek()) {
				minH.insert(maxH.poll());
				maxH.insert(randNum);
			} else {
				minH.insert(randNum);
			}
		}
	};
	that.getMedian = function() {
		if(maxH.isEmtpy()) return 0;
		if(maxH.size() == minH.size()) {
			return Math.floor((minH.peek() + maxH.peek()) / 2);
		} else {
			return maxH.peek();
		}
	};
	init();
	return that;
};