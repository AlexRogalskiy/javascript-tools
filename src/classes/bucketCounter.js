jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.bucketCounter = function(spec) {
	var /*numBuckets,*/ secsPerBucket;
	var lastUpdateTime, bucketsQueue;
	var conveyorQueue = function(_maxItems) {
		//
		//maxItems = (maxItems == null) ? 10 : (jsar.toolset.isNumber(maxItems) && maxItems > 0) ? maxItems : null;
		//if(maxItems == null) throw {name: 'ValueError', message: 'incorrect \'max items\' value: < ' + maxItems + ' >'};
		//
		var queue = jsar.collections.queue();
		var maxItems = totalSum = 0;
		//var obj = {};
		var obj = Object.create(conveyorQueue.prototype);
		//obj.prototype = conveyorQueue;
		//
		var init = function() {
			if(!jsar.toolset.isNull(_maxItems)) {
				if(!jsar.toolset.isIntNumber(_maxItems) || _maxItems < 0) { throw {
																				name: 'ValueError',
																				message: 'incorrect initialization value \'maxItems\': [positive integer number]'
																			};
				}
				maxItems = _maxItems;
			}
		};
		obj.shift = function(numShift) {
			if(!jsar.toolset.isIntNumber(numShift) || numShift < 0) { throw {
																			name: 'ValueError',
																			message: 'incorrect initialization value \'shift num\': [positive integer number]'
																		};
			}
			if(numShift >= maxItems) {
				queue = jsar.collections.queue();
				totalSum = 0;
				return;
			}
			while(numShift > 0) {
				queue.enqueue(0);
				numShift--;
			}
			while(queue.size() > maxItems) {
				var item = queue.dequeue();
				if(item != null) {
					totalSum -= item;
				}
			}
		};
		obj.addToBack = function(item) {
			if(queue.isEmpty()) this.shift(1);
			queue.updateAt(queue.size(), queue.back() + item);
			totalSum += item;
		};
		obj.getTotalSum = function() {
			return totalSum;
		}:	
		init();
		return obj;
	};
	//var that = {};
	var that = Object.create(jsar.utils.bucketCounter.prototype);
	//that.prototype = jsar.utils.bucketCounter;
	//
	var init = function() {
		if(!jsar.toolset.isNull(spec)) {
			if(!jsar.toolset.isObject(spec)) { throw {
												name: 'ValueError',
												message: 'incorrect initialization value: [object]'
											};
			}
			if(Object.prototype.hasOwnProperty.call(spec, 'numOfBuckets') && Object.prototype.hasOwnProperty.call(spec, 'secsPerBucket') && jsar.toolset.isIntNumber(spec.numOfBuckets) && jsar.toolset.isIntNumber(spec.secsPerBucket) && spec.numOfBuckets > 0 && spec.secsPerBucket > 0) {
				//numBuckets = spec.numBuckets;
				bucketsQueue = conveyorQueue(spec.numBuckets);
				secsPerBucket = spec.secsPerBucket;
			} else {
				var o = Object.create(Error.prototype, {name: 'ValueError', message: 'incorrect initialization values: {\'numOfBuckets\': [positive integer number], \'secsPerBucket\': [positive integer number]}'});
				throw o;
				//throw {
				//	name: 'ValueError',
				//	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'
				//};
			}
		}
	};
	var getCurrentTime = function() {
		return (new Date()).getTime();
	};
	var update = function(timePoint) {
		if(!jsar.toolset.isNumber(timePoint) || timePoint < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect value \'timePoint\': [positive number]'
																};
		}
		var currentBucket = Math.ceil(timePoint / secsPerBucket);
		var lastUpdateBucket = Math.ceil(lastUpdateTime / secsPerBucket);
		bucketsQueue.shift(currentBucket - lastUpdateBucket);
		lastUpdateTime = timePoint;
	};
	that.addItem = function(item) { /*timePoint*/
		if(!jsar.toolset.isNumber(item)) { throw {
												name: 'ValueError',
												message: 'incorrect value \'item\': [number]'
											};
		}
		var timePoint = getCurrentTime();
		update(timePoint);
		bucketsQueue.addToBack(item);
	};
	that.getTrailingCount = function() { /*timePoint*/
		var timePoint = getCurrentTime();
		update(timePoint);
		return bucketsQueue.getTotalSum();
	};
	that.clone = function() {
		return jsar.utils.bucketCounter({'xnumOfBuckets': numOfBuckets, 'secsPerBucket': secsPerBucket});
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
