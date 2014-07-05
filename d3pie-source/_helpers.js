// --------- helpers.js -----------
var helpers = {

	// creates the SVG element
	addSVGSpace: function(pie) {
		var element = pie.element;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var backgroundColor = pie.options.misc.colors.background;

		var svg = d3.select(element).append("svg:svg")
			.attr("width", canvasWidth)
			.attr("height", canvasHeight);

		if (backgroundColor !== "transparent") {
			svg.style("background-color", function() { return backgroundColor; });
		}

		return svg;
	},

	whenIdExists: function(id, callback) {
		var inc = 1;
		var giveupIterationCount = 1000;

		var interval = setInterval(function() {
			if (document.getElementById(id)) {
				clearInterval(interval);
				callback();
			}
			if (inc > giveupIterationCount) {
				clearInterval(interval);
			}
			inc++;
		}, 1);
	},

	whenElementsExist: function(els, callback) {
		var inc = 1;
		var giveupIterationCount = 1000;

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
			if (inc > giveupIterationCount) {
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
		if (typeof is === 'string') {
			return helpers.processObj(obj, is.split('.'), value);
		} else if (is.length === 1 && value !== undefined) {
            obj[is[0]] = value;
			return obj[is[0]];
		} else if (is.length === 0) {
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
			var c = parseInt(hex.substr(i * 2, 2), 16);
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
	 * This function sees what's included and populates this.options.colors with whatever's required
	 * for this pie chart.
	 * @param data
	 */
	initSegmentColors: function(pie) {
		var data   = pie.options.data.content;
		var colors = pie.options.misc.colors.segments;

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

	applySmallSegmentGrouping: function(data, smallSegmentGrouping) {
		var totalSize;
		if (smallSegmentGrouping.valueType === "percentage") {
			totalSize = math.getTotalPieSize(data);
		}

		// loop through each data item
		var newData = [];
		var groupedData = [];
		var totalGroupedData = 0;
		for (var i=0; i<data.length; i++) {
			if (smallSegmentGrouping.valueType === "percentage") {
				var dataPercent = (data[i].value / totalSize) * 100;
				if (dataPercent <= smallSegmentGrouping.value) {
					groupedData.push(data[i]);
					totalGroupedData += data[i].value;
					continue;
				}
				data[i].isGrouped = false;
				newData.push(data[i]);
			} else {
				if (data[i].value <= smallSegmentGrouping.value) {
					groupedData.push(data[i]);
					totalGroupedData += data[i].value;
					continue;
				}
				data[i].isGrouped = false;
				newData.push(data[i]);
			}
		}

		// we're done! See if there's any small segment groups to add
		if (groupedData.length) {
			newData.push({
				color: smallSegmentGrouping.color,
				label: smallSegmentGrouping.label,
				value: totalGroupedData,
				isGrouped: true,
				groupedData: groupedData
			});
		}

		return newData;
	},

	// for debugging
	showPoint: function(svg, x, y) {
		svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 2).style("fill", "black");
	},

	isFunction: function(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	},

	isArray: function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
};


// taken from jQuery
var extend = function() {
	var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false,
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty,
		class2type = {
			"[object Boolean]": "boolean",
			"[object Number]": "number",
			"[object String]": "string",
			"[object Function]": "function",
			"[object Array]": "array",
			"[object Date]": "date",
			"[object RegExp]": "regexp",
			"[object Object]": "object"
		},

		jQuery = {
			isFunction: function (obj) {
				return jQuery.type(obj) === "function";
			},
			isArray: Array.isArray ||
				function (obj) {
					return jQuery.type(obj) === "array";
				},
			isWindow: function (obj) {
				return obj !== null && obj === obj.window;
			},
			isNumeric: function (obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},
			type: function (obj) {
				return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";
			},
			isPlainObject: function (obj) {
				if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
					return false;
				}
				try {
					if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
				} catch (e) {
					return false;
				}
				var key;
				for (key in obj) {}
				return key === undefined || hasOwn.call(obj, key);
			}
		};
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}
	if (typeof target !== "object" && !jQuery.isFunction(target)) {
		target = {};
	}
	if (length === i) {
		target = this;
		--i;
	}
	for (i; i < length; i++) {
		if ((options = arguments[i]) !== null) {
			for (name in options) {
				src = target[name];
				copy = options[name];
				if (target === copy) {
					continue;
				}
				if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];
					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}
					// WARNING: RECURSION
					target[name] = extend(deep, clone, copy);
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}
	return target;
};