/**
 *  --------- helpers.js -----------
 *
 * Misc helper functions.
 */
var helpers = {

	// creates the SVG element
	addSVGSpace: function(element, width, height, color) {
		_svg = d3.select(element).append("svg:svg")
			.attr("width", width)
			.attr("height", height);

		if (_options.misc.colors.background !== "transparent") {
			_svg.style("background-color", function() { return color; });
		}
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
			return helpers.processObj(obj, is.split('.'), value);
		} else if (is.length == 1 && value !== undefined) {
			return obj[is[0]] = value;
		} else if (is.length == 0) {
			return obj;
		} else {
			return helpers.processObj(obj[is[0]], is.slice(1), value);
		}
	},

	getDimensions: function(id) {
		var el = document.getElementById(id);
		var w = 0, h = 0;
		if (el) {
			var dimensions = el.getBBox();
			w = dimensions.width;
			h = dimensions.height;
		} else {
			console.log("error: getDimensions() " + id + " not found.");
		}
		return { w: w, h: h };
	},


	/**
	 * This is based on the SVG coordinate system, where top-left is 0,0 and bottom right is n-n.
	 * @param r1
	 * @param r2
	 * @returns {boolean}
	 */
	rectIntersect: function(r1, r2) {
		var returnVal = (
			// r2.left > r1.right
			(r2.x > (r1.x + r1.w)) ||

			// r2.right < r1.left
			((r2.x + r2.w) < r1.x) ||

			// r2.top < r1.bottom
			((r2.y + r2.h) < r1.y) ||

			// r2.bottom > r1.top
			(r2.y > (r1.y + r1.h))
		);

		return !returnVal;
	},

	/**
	 * Returns a lighter/darker shade of a hex value, based on a luminance value passed.
	 * @param hex a hex color value such as “#abc” or “#123456″ (the hash is optional)
	 * @param lum the luminosity factor: -0.1 is 10% darker, 0.2 is 20% lighter, etc.
	 * @returns {string}
	 */
	getColorShade: function(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var newHex = "#";
		for (var i=0; i<3; i++) {
			var c = parseInt(hex.substr(i*2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			newHex += ("00" + c).substr(c.length);
		}

		return newHex;
	},

	/**
	 * Users can choose to specify segment colors in three ways (in order of precedence):
	 * 	1. include a "color" attribute for each row in data.content
	 * 	2. include a misc.colors.segments property which contains an array of hex codes
	 * 	3. specify nothing at all and rely on this lib provide some reasonable defaults
	 *
	 * This function sees what's included and populates _options.colors with whatever's required
	 * for this pie chart.
	 * @param data
	 */
	initSegmentColors: function(data, colors) {
		// TODO this needs a ton of error handling

		var finalColors = [];
		for (var i=0; i<data.length; i++) {
			if (data[i].hasOwnProperty("color")) {
				finalColors.push(data[i].color);
			} else {
				finalColors.push(colors[i]);
			}
		}


		return finalColors;
	},

	// for debugging
	showPoint: function(x, y) {
		_svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 2).style("fill", "black");
	}
};
