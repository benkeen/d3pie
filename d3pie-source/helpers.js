// --------- helpers.js -----------
d3pie.helpers = {

	// creates the SVG element
	addSVGSpace: function(element, width, height, color) {
		_svg = d3.select(element).append("svg:svg")
			.attr("width", width)
			.attr("height", height);

		if (_options.styles.backgroundColor !== "transparent") {
			_svg.style("background-color", function() { return color; });
		}
	},

	toRadians: function(degrees) {
		return degrees * (Math.PI / 180);
	},

	toDegrees: function(radians) {
		return radians * (180 / Math.PI);
	},

	whenIdExists: function(id, callback) {
		var inc = 1;
		var giveupTime = 1000;

		var interval = setInterval(function() {
			if (document.getElementById(id)) {
				clearInterval(interval);
				callback();
			}
			if (inc > giveupTime) {
				clearInterval(interval);
			}
			inc++;
		}, 1);
	},

	whenElementsExist: function(els, callback) {
		var inc = 1;
		var giveupTime = 1000;

		var interval = setInterval(function() {
			var allExist = true;
			for (var i=0; i<els.length; i++) {
				if (!document.getElementById(els[i])) {
					allExist = false;
					break;
				}
			}
			if (allExist) {
				clearInterval(interval);
				callback();
			}
			if (inc > giveupTime) {
				clearInterval(interval);
			}
			inc++;
		}, 1);

	},

	shuffleArray: function(array) {
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
	},

	processObj: function(obj, is, value) {
		if (typeof is == 'string') {
			return d3pie.helpers.processObj(obj, is.split('.'), value);
		} else if (is.length == 1 && value !== undefined) {
			return obj[is[0]] = value;
		} else if (is.length == 0) {
			return obj;
		} else {
			return d3pie.helpers.processObj(obj[is[0]], is.slice(1), value);
		}
	},

	getHeight: function(id) {
		var dimensions = document.getElementById(id).getBBox();
		return dimensions.height;
	},

	getWidth: function(id) {
		var dimensions = document.getElementById(id).getBBox();
		return dimensions.width;
	},

	getDimensions: function(id) {
		var dimensions = document.getElementById(id).getBBox();
		return {
			w: dimensions.width,
			h: dimensions.height
		}
	}
};
