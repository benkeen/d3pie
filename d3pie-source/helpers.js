d3pie.helpers = function() {

	var _toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var _toDegrees = function(radians) {
		return radians * (180 / Math.PI);
	};

	var _whenIdExists = function(id, callback) {
		var inc = 1;
		var giveupTime = 1000;
		var interval = setInterval(function () {
			if (document.getElementById(id)) {
				clearInterval(interval);
				callback();
			}
			if (inc > giveupTime) {
				clearInterval(interval);
			}
			inc++;
		}, 1);
	};

	var _shuffleArray = function(array) {
		var currentIndex = array.length, tmpVal, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// and swap it with the current element
			tmpVal = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = tmpVal;
		}
		return array;
	};

	var _processObj = function(obj, is, value) {
		if (typeof is == 'string') {
			return _processObj(obj, is.split('.'), value);
		} else if (is.length == 1 && value !== undefined) {
			return obj[is[0]] = value;
		} else if (is.length == 0) {
			return obj;
		} else {
			return _processObj(obj[is[0]], is.slice(1), value);
		}
	};

	var _getHeight = function(id) {
		var dimensions = document.getElementById(id).getBBox();
		return dimensions.height;
	};

	var _getWidth = function(id) {
		var dimensions = document.getElementById(id).getBBox();
		return dimensions.width;
	};

	return {
		toRadians: _toRadians,
		toDegrees: _toDegrees,
		shuffleArray: _shuffleArray,
		whenIdExists: _whenIdExists,
		processObj: _processObj,
		getHeight: _getHeight,
		getWidth: _getWidth
	};
};
