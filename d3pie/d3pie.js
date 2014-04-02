/*!
 * d3pie
 * @author Ben Keen
 * @version 0.1.0
 * @date Apr 2014
 * http://github.com/benkeen/d3pie
 */
;(function($) {
	"use strict";

	var _scriptName = "d3pie";
	var _version = "0.1.0";

	// used to uniquely generate IDs and classes, ensuring no conflict between multiple pies on the same page
	var _uniqueIDCounter = 0;


	// this section includes all helper libs on the d3pie object. They're populated via grunt-template. Note: to keep
	// the syntax highlighting from getting all messed up, I commented out each line. That REQUIRES each of the files
	// to have an empty first line. Crumby, yes, but acceptable.
	//// --------- labels.js -----------/**
/**
 * Contains the out-the-box settings for the script. Any of these settings that aren't explicitly overridden for the
 * d3pie instance will inherit from these.
 */
var defaultSettings = {
	header: {
		title: {
			color:    "#333333",
			fontSize: "14px",
			font:     "helvetica"
		},
		subtitle: {
			color:    "#333333",
			fontSize: "14px",
			font:     "helvetica"
		},
		location: "top-left",
		titleSubtitlePadding: 8
	},
	footer: {
		text: ""
	},
	size: {
		canvasHeight: 500,
		canvasWidth: 500,
		pieInnerRadius: "0%",
		pieOuterRadius: null
	},
	data: {
		sortOrder: "value-asc"
	},
	labels: {
		enableTooltips: true,
		outer: {
			format: "label",
			hideWhenLessThanPercentage: null,
			pieDistance: 30
		},
		inner: {
			format: "percentage",
			hideWhenLessThanPercentage: null
		},
		mainLabel: {
			color: "#333333",
			font: "Open sans",
			fontSize: "10px"
		},
		percentage: {
			color: "#999999",
			font: "Open sans",
			fontSize: "10px",
			decimalPlaces: 0
		},
		value: {
			color: "#cccc44",
			font: "Open sans",
			fontSize: "10px"
		},
		lines: {
			enabled: true,
			style: "curved",
			length: 16,
			color: "segment" // "segment" or a hex color
		}
	},
	effects: {
		load: {
			effect: "default", // none / default
			speed: 1000
		},
		pullOutSegmentOnClick: {
			effect: "bounce", // none / linear / bounce
			speed: 300,
			size: 10
		},
		highlightSegmentOnMouseover: true,
		highlightLuminosity: -0.2
	},
	misc: {
		cssPrefix: null,
		colors: {
			background: null,
			segments: [
				"#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"
			],
			segmentStroke: "#ffffff"
		},
		canvasPadding: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		pieCenterOffset: {
			x: 0,
			y: 0
		},
		footerPiePadding: 0
	},
	callbacks: {
		onload: null,
		onMouseoverSegment: null,
		onMouseoutSegment: null,
		onClickSegment: null
	}
};

	//// --------- validate.js -----------
var validate = {

	// called whenever a new pie chart is created
	initialCheck: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var element = pie.element;
		var options = pie.options;

		// confirm d3 is available [check minimum version]
		if (!window.d3 || !window.d3.hasOwnProperty("version")) {
			console.error("d3pie error: d3 is not available");
			return false;
		}

		// confirm element is either a DOM element or a valid string for a DOM element
		if (!(element instanceof HTMLElement)) {
			console.error("d3pie error: the first d3pie() param must be a valid DOM element (not jQuery) or a ID string.");
			return false;
		}

		// confirm some data has been supplied
		if (!options.data.hasOwnProperty("content")) {
			console.error("d3pie error: invalid config structure: missing data.content property.");
			return false;
		}
		if (!$.isArray(options.data.content) || pie.options.data.content.length === 0) {
			console.error("d3pie error: no data supplied.");
			return false;
		}

		// confirm the CSS prefix is valid. It has to start with a-Z and contain nothing but a-Z0-9_-
		if (!(/[a-zA-Z][a-zA-Z0-9_-]*$/.test(cssPrefix))) {
			console.error("d3pie error: invalid options.misc.cssPrefix");
			return false;
		}

		return true;
	}
};
	//// --------- helpers.js -----------
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

		if (this.backgroundColor !== "transparent") {
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
		var data   = pie.options.data;
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

	// for debugging
	showPoint: function(svg, x, y) {
		svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 2).style("fill", "black");
	}
};
	//// --------- math.js -----------
var math = {

	toRadians: function(degrees) {
		return degrees * (Math.PI / 180);
	},

	toDegrees: function(radians) {
		return radians * (180 / Math.PI);
	},

	computePieRadius: function(pie) {
		var size = pie.options.size;
		var canvasPadding = pie.options.misc.canvasPadding;

		// outer radius is either specified (e.g. through the generator), or omitted altogether
		// and calculated based on the canvas dimensions. Right now the estimated version isn't great - it should
		// be possible to calculate it to precisely generate the maximum sized pie, but it's fussy as heck


		// first, calculate the default _outerRadius
		var w = size.canvasWidth - canvasPadding.left - canvasPadding.right;
		var h = size.canvasHeight;

		var outerRadius = ((w < h) ? w : h) / 2.8;
		var innerRadius, percent;

		// if the user specified something, use that instead
		if (size.pieOuterRadius !== null) {
			if (/%/.test(size.pieOuterRadius)) {
				percent = parseInt(size.pieOuterRadius.replace(/[\D]/, ""), 10);
				percent = (percent > 99) ? 99 : percent;
				percent = (percent < 0) ? 0 : percent;
				var smallestDimension = (w < h) ? w : h;
				outerRadius = Math.floor((smallestDimension / 100) * percent) / 2;
			} else {
				// TODO bounds checking
				outerRadius = parseInt(size.pieOuterRadius, 10);
			}
		}

		// inner radius
		if (/%/.test(size.pieInnerRadius)) {
			percent = parseInt(size.pieInnerRadius.replace(/[\D]/, ""), 10);
			percent = (percent > 99) ? 99 : percent;
			percent = (percent < 0) ? 0 : percent;
			innerRadius = Math.floor((outerRadius / 100) * percent);
		} else {
			innerRadius = parseInt(size.pieInnerRadius, 10);
		}

		pie.innerRadius = innerRadius;
		pie.outerRadius = outerRadius;
	},

	getTotalPieSize: function(data) {
		var totalSize = 0;
		for (var i=0; i<data.length; i++) {
			totalSize += data[i].value;
		}
		return totalSize;
	},

	sortPieData: function(pie) {
		var data      = pie.options.data.content;
		var sortOrder = pie.options.data.sortOrder;

		switch (sortOrder) {
			case "none":
				// do nothing.
				break;
			case "random":
				data = helpers.shuffleArray(data);
				break;
			case "value-asc":
				data.sort(function(a, b) { return (a.value < b.value) ? -1 : 1 });
				break;
			case "value-desc":
				data.sort(function(a, b) { return (a.value < b.value) ? 1 : -1 });
				break;
			case "label-asc":
				data.sort(function(a, b) { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1 });
				break;
			case "label-desc":
				data.sort(function(a, b) { return (a.label.toLowerCase() < b.label.toLowerCase()) ? 1 : -1 });
				break;
		}
		return data;
	},

	// var pieCenter = math.getPieCenter();
	getPieTranslateCenter: function(pieCenter) {
		return "translate(" + pieCenter.x + "," + pieCenter.y + ")"
	},

	/**
	 * Used to determine where on the canvas the center of the pie chart should be. It takes into account the
	 * height and position of the title, subtitle and footer, and the various paddings.
	 * @private
	 */
	calculatePieCenter: function(pie) {
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var pieCenterOffset = pie.options.misc.pieCenterOffset;

		var hasTopTitle    = (pie.textComponents.title.exists && headerLocation !== "pie-center");
		var hasTopSubtitle = (pie.textComponents.subtitle.exists && headerLocation !== "pie-center");

		var headerOffset = canvasPadding.top;
		if (hasTopTitle && hasTopSubtitle) {
			headerOffset += pie.textComponents.title.h + titleSubtitlePadding + pie.textComponents.subtitle.h;
		} else if (hasTopTitle) {
			headerOffset += pie.textComponents.title.h;
		} else if (hasTopSubtitle) {
			headerOffset = pie.textComponents.subtitle.h;
		}

		var footerOffset = 0;
		if (pie.textComponents.footer.exists) {
			footerOffset = pie.textComponents.footer.h + canvasPadding.bottom;
		}

		var x = ((canvasWidth - canvasPadding.left - canvasPadding.right) / 2) + canvasPadding.left;
		var y = ((canvasHeight - footerOffset - headerOffset) / 2) + headerOffset;

		x += pieCenterOffset.x;
		y += pieCenterOffset.y;

		pie.pieCenter = { x: x, y: y };
	},


	// TODO this will cause a bug
	arcTween: function(b) {
		var i = d3.interpolate({ value: 0 }, b);
		return function(t) {
			return _arc(i(t));
		};
	},


	/**
	 * Rotates a point (x, y) around an axis (xm, ym) by degrees (a).
	 * @param x
	 * @param y
	 * @param xm
	 * @param ym
	 * @param a angle in degrees
	 * @returns {Array}
	 */
	rotate: function(x, y, xm, ym, a) {
		var cos = Math.cos,
			sin = Math.sin,

		a = a * Math.PI / 180, // convert to radians

		// subtract midpoints, so that midpoint is translated to origin and add it in the end again
		xr = (x - xm) * cos(a) - (y - ym) * sin(a) + xm,
		yr = (x - xm) * sin(a) + (y - ym) * cos(a) + ym;

		return { x: xr, y: yr };
	},

	/**
	 * Translates a point x, y by distance d, and by angle a.
	 * @param x
	 * @param y
	 * @param dist
	 * @param a angle in degrees
	 */
	translate: function(x, y, d, a) {
		var rads = math.toRadians(a);
		return {
			x: x + d * Math.sin(rads),
			y: y - d * Math.cos(rads)
		};
	},

	// from: http://stackoverflow.com/questions/19792552/d3-put-arc-labels-in-a-pie-chart-if-there-is-enough-space
	pointIsInArc: function(pt, ptData, d3Arc) {
		// Center of the arc is assumed to be 0,0
		// (pt.x, pt.y) are assumed to be relative to the center
		var r1 = d3Arc.innerRadius()(ptData), // Note: Using the innerRadius
			r2 = d3Arc.outerRadius()(ptData),
			theta1 = d3Arc.startAngle()(ptData),
			theta2 = d3Arc.endAngle()(ptData);

		var dist = pt.x * pt.x + pt.y * pt.y,
			angle = Math.atan2(pt.x, -pt.y); // Note: different coordinate system

		angle = (angle < 0) ? (angle + Math.PI * 2) : angle;

		return (r1 * r1 <= dist) && (dist <= r2 * r2) &&
			(theta1 <= angle) && (angle <= theta2);
	}
};
	//// --------- labels.js -----------
var labels = {

	outerLabelGroupData: [],
	lineCoordGroups: [],

	/**
	 * Adds the labels to the pie chart, but doesn't position them. There are two locations for the
	 * labels: inside (center) of the segments, or outside the segments on the edge.
	 * @param section "inner" or "outer"
	 * @param sectionDisplayType "percentage", "value", "label", "label-value1", etc.
	 */
	add: function(section, pie) {
		var include = labels.getIncludes(pie.options.labels.inner.format);
		var settings = pie.options.labels;


		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var outerLabel = pie.svg.insert("g", "." + pie.cssPrefix + "labels-" + section)
			.attr("class", pie.cssPrefix + "labels-" + section);

		var labelGroup = outerLabel.selectAll(".labelGroup-" + section)
			.data(pie.options.data)
			.enter()
			.append("g")
			.attr("id", function(d, i) { return pie.cssPrefix + "labelGroup" + i + "-" + section; })
			.attr("class", pie.cssPrefix + "labelGroup-" + section)
			.style("opacity", 0);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("id", function(d, i) { return pie.cssPrefix + "segmentMainLabel" + i + "-" + section; })
				.attr("class", pie.cssPrefix + "segmentMainLabel-" + section)
				.text(function(d) { return d.label; })
				.style("font-size", settings.mainLabel.fontSize)
				.style("font-family", settings.mainLabel.font)
				.style("fill", settings.mainLabel.color);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("id", function(d, i) { return pie.cssPrefix + "segmentPercentage" + i + "-" + section; })
				.attr("class", pie.cssPrefix + "segmentPercentage-" + section)
				.text(function(d) {
					var percent = (d.value / pie.totalSize) * 100;
					return percent.toFixed(pie.options.labels.percentage.decimalPlaces) + "%";
				})
				.style("font-size", settings.percentage.fontSize)
				.style("font-family", settings.percentage.font)
				.style("fill", settings.percentage.color);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("id", function(d, i) { return pie.cssPrefix +  "segmentValue" + i + "-" + section; })
				.attr("class", pie.cssPrefix + "segmentValue-" + section)
				.text(function(d) { return d.value; })
				.style("font-size", settings.value.fontSize)
				.style("font-family", settings.value.font)
				.style("fill", settings.value.color);
		}
	},

	/**
	 * @param section "inner" / "outer"
	 */
	positionLabelElements: function(section, sectionDisplayType) {
		labels["dimensions-" + section] = [];

		// get the latest widths, heights
		var labelGroups = $(".labelGroup-" + section);

		for (var i=0; i<labelGroups.length; i++) {
			var mainLabel = $(labelGroups[i]).find(".segmentMainLabel-" + section);
			var percentage = $(labelGroups[i]).find(".segmentPercentage-" + section);
			var value = $(labelGroups[i]).find(".segmentValue-" + section);

			labels["dimensions-" + section].push({
				mainLabel: (mainLabel.length > 0) ? mainLabel[0].getBBox() : null,
				percentage: (percentage.length > 0) ? percentage[0].getBBox() : null,
				value: (value.length > 0) ? value[0].getBBox() : null
			});
		}

		var singleLinePad = 5;
		var dims = labels["dimensions-" + section];
		switch (sectionDisplayType) {
			case "label-value1":
				d3.selectAll(".segmentValue-" + section)
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-value2":
				d3.selectAll(".segmentValue-" + section)
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
			case "label-percentage1":
				d3.selectAll(".segmentPercentage-" + section)
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-percentage2":
				d3.selectAll(".segmentPercentage-" + section)
					.attr("dx", function(d, i) { return (dims[i].mainLabel.width / 2) - (dims[i].percentage.width / 2); })
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
	 	}
	},

	computeLabelLinePositions: function() {
		labels.lineCoordGroups = [];

		d3.selectAll(".labelGroup-outer")
			.each(function(d, i) { return labels.computeLinePosition(i); });
	},

	computeLinePosition: function(i) {
		var angle = segments.getSegmentAngle(i, { midpoint: true});
		var center = math.getPieCenter();

		var originCoords = math.rotate(center.x, center.y - _outerRadius, center.x, center.y, angle);
		var heightOffset = labels.outerLabelGroupData[i].h / 5; // TODO check
		var labelXMargin = 6; // the x-distance of the label from the end of the line [TODO configurable]

		var quarter = Math.floor(angle / 90);
		var midPoint = 4;
		var x2, y2, x3, y3;
		switch (quarter) {
			case 0:
				x2 = labels.outerLabelGroupData[i].x - labelXMargin - ((labels.outerLabelGroupData[i].x - labelXMargin - originCoords.x) / 2);
				y2 = labels.outerLabelGroupData[i].y + ((originCoords.y - labels.outerLabelGroupData[i].y) / midPoint);
				x3 = labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 1:
				x2 = originCoords.x + (labels.outerLabelGroupData[i].x - originCoords.x) / midPoint;
				y2 = originCoords.y + (labels.outerLabelGroupData[i].y - originCoords.y) / midPoint;
				x3 = labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 2:
				var startOfLabelX = labels.outerLabelGroupData[i].x + labels.outerLabelGroupData[i].w + labelXMargin;
				x2 = originCoords.x - (originCoords.x - startOfLabelX) / midPoint;
				y2 = originCoords.y + (labels.outerLabelGroupData[i].y - originCoords.y) / midPoint;
				x3 = labels.outerLabelGroupData[i].x + labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 3:
				var startOfLabel = labels.outerLabelGroupData[i].x + labels.outerLabelGroupData[i].w + labelXMargin;
				x2 = startOfLabel + ((originCoords.x - startOfLabel) / midPoint);
				y2 = labels.outerLabelGroupData[i].y + (originCoords.y - labels.outerLabelGroupData[i].y) / midPoint;
				x3 = labels.outerLabelGroupData[i].x + labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = labels.outerLabelGroupData[i].y - heightOffset;
				break;
		}

		/*
		 * x1 / y1: the x/y coords of the start of the line, at the mid point of the segments arc on the pie circumference
		 * x2 / y2: if "curved" line style is being used, this is the midpoint of the line. Other
		 * x3 / y3: the end of the line; closest point to the label
		 */
		if (this.options.labels.lines.style === "straight") {
			labels.lineCoordGroups[i] = [
				{ x: originCoords.x, y: originCoords.y },
				{ x: x3, y: y3 }
			];
		} else {
			labels.lineCoordGroups[i] = [
				{ x: originCoords.x, y: originCoords.y },
				{ x: x2, y: y2 },
				{ x: x3, y: y3 }
			];
		}
	},

	addLabelLines: function() {
		var lineGroups = this.svg.insert("g", ".pieChart") // meaning, BEFORE .pieChart
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(labels.lineCoordGroups)
			.enter()
			.append("g")
			.attr("class", "lineGroup");

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", function(d, i) {
				return (this.options.labels.lines.color === "segment") ? this.options.colors[i] : this.options.labels.lines.color;
			})
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.style("opacity", function(d, i) {
				var percentage = this.options.labels.outer.hideWhenLessThanPercentage;
				var segmentPercentage = segments.getPercentage(i);
				return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
			})
	},

	positionLabelGroups: function(section) {
		d3.selectAll(".labelGroup-" + section)
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				var x, y;
				if (section === "outer") {
					x = labels.outerLabelGroupData[i].x;
					y = labels.outerLabelGroupData[i].y;
				} else {
					var center = math.getPieCenter();

					// now recompute the "center" based on the current _innerRadius
					if (_innerRadius > 0) {
						var angle = segments.getSegmentAngle(i, { midpoint: true });
						var newCoords = math.translate(center.x, center.y, _innerRadius, angle);

						center.x = newCoords.x;
						center.y = newCoords.y;
					}

					var dims = helpers.getDimensions("labelGroup" + i + "-inner");
					var xOffset = dims.w / 2;
					var yOffset = dims.h / 4; // confusing! Why 4? should be 2, but it doesn't look right

					x = center.x + (labels.lineCoordGroups[i][0].x - center.x) / 1.8;
					y = center.y + (labels.lineCoordGroups[i][0].y - center.y) / 1.8;

					x = x - xOffset;
					y = y + yOffset;
				}

				return "translate(" + x + "," + y + ")";
			});
	},


	fadeInLabelsAndLines: function() {

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (this.options.effects.load.effect === "default") ? this.options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (this.options.effects.load.effect === "default") ? 400 : 1; // 400 is hardcoded for the present

			d3.selectAll(".labelGroup-outer")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", function(d, i) {
					var percentage = this.options.labels.outer.hideWhenLessThanPercentage;
					var segmentPercentage = segments.getPercentage(i);
					return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
				});

			d3.selectAll(".labelGroup-inner")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", function(d, i) {
					var percentage = this.options.labels.inner.hideWhenLessThanPercentage;
					var segmentPercentage = segments.getPercentage(i);
					return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
				});

			d3.selectAll("g.lineGroups")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);

			// once everything's done loading, trigger the onload callback if defined
			if ($.isFunction(this.options.callbacks.onload)) {
				setTimeout(function() {
					try {
						this.options.callbacks.onload();
					} catch (e) { }
				}, labelFadeInTime);
			}
		}, loadSpeed);
	},

	getIncludes: function(val) {
		var addMainLabel  = false;
		var addValue      = false;
		var addPercentage = false;

		// TODO refactor... somehow
		switch (val) {
			case "label":
				addMainLabel = true;
				break;
			case "value":
				addValue = true;
				break;
			case "percentage":
				addPercentage = true;
				break;
			case "label-value1":
			case "label-value2":
				addMainLabel = true;
				addValue = true;
				break;
			case "label-percentage1":
			case "label-percentage2":
				addMainLabel = true;
				addPercentage = true;
				break;
		}
		return {
			mainLabel: addMainLabel,
			value: addValue,
			percentage: addPercentage
		};
	},


	/**
	 * This does the heavy-lifting to compute the actual coordinates for the outer label groups. It does two things:
	 * 1. Make a first pass and position them in the ideal positions, based on the pie sizes
	 * 2. Do some basic collision avoidance.
	 */
	computeOuterLabelCoords: function() {
		// 1. figure out the ideal positions for the outer labels
		d3.selectAll(".labelGroup-outer")
			.each(function(d, i) { return labels.getIdealOuterLabelPositions(i); });

		// 2. now adjust those positions to try to accommodate conflicts
		labels.resolveOuterLabelCollisions();
	},

	/**
	 * This attempts to resolve label positioning collisions.
	 */
	resolveOuterLabelCollisions: function() {
		var size = this.options.data.length;
		labels.checkConflict(0, "clockwise", size);
		labels.checkConflict(size-1, "anticlockwise", size);
	},

	checkConflict: function(currIndex, direction, size) {
		var currIndexHemisphere = labels.outerLabelGroupData[currIndex].hs;
		if (direction === "clockwise" && currIndexHemisphere != "right") {
			return;
		}
		if (direction === "anticlockwise" && currIndexHemisphere != "left") {
			return;
		}
		var nextIndex = (direction === "clockwise") ? currIndex+1 : currIndex-1;

		// this is the current label group being looked at. We KNOW it's positioned properly (the first item
		// is always correct)
		var currLabelGroup = labels.outerLabelGroupData[currIndex];

		// this one we don't know about. That's the one we're going to look at and move if necessary
		var examinedLabelGroup = labels.outerLabelGroupData[nextIndex];

		var info = {
			labelHeights: labels.outerLabelGroupData[0].h,
			center: math.getPieCenter(),
			lineLength: (_outerRadius + this.options.labels.outer.pieDistance),
			heightChange: labels.outerLabelGroupData[0].h + 1 // 1 = padding
		};

		// loop through *ALL* label groups examined so far to check for conflicts. This is because when they're
		// very tightly fitted, a later label group may still appear high up on the page
		if (direction === "clockwise") {
			for (var i=0; i<=currIndex; i++) {
				var curr = labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (helpers.rectIntersect(curr, examinedLabelGroup)) {
					labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		} else {
			for (var i=size-1; i>=currIndex; i--) {
				var curr = labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (helpers.rectIntersect(curr, examinedLabelGroup)) {
					labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		}
		labels.checkConflict(nextIndex, direction, size);
	},

	// does a little math to shift a label into a new position based on the last properly placed one
	adjustLabelPos: function(nextIndex, lastCorrectlyPositionedLabel, info) {
		var xDiff, yDiff, newXPos, newYPos;
		newYPos = lastCorrectlyPositionedLabel.y + info.heightChange;
		yDiff = info.center.y - newYPos;

		if (Math.abs(info.lineLength) > Math.abs(yDiff)) {
			xDiff = Math.sqrt((info.lineLength * info.lineLength) - (yDiff * yDiff));
		} else {
			console.log(yDiff, info);
			xDiff = Math.sqrt((yDiff * yDiff) - (info.lineLength * info.lineLength));
		}


		// ahhh! info.lineLength is no longer a constant.....

		if (lastCorrectlyPositionedLabel.hs === "right") {
			newXPos = info.center.x + xDiff;
		} else {
			newXPos = info.center.x - xDiff - labels.outerLabelGroupData[nextIndex].w;
		}

		if (!newXPos) {
			console.log(lastCorrectlyPositionedLabel.hs, xDiff)
		}

		labels.outerLabelGroupData[nextIndex].x = newXPos;
		labels.outerLabelGroupData[nextIndex].y = newYPos;
	},

	/**
	 * @param i 0-N where N is the dataset size - 1.
	 */
	getIdealOuterLabelPositions: function(i) {
		var labelGroupDims = $("#labelGroup" + i + "-outer")[0].getBBox();
		var angle = segments.getSegmentAngle(i, { midpoint: true });

		var center = math.getPieCenter();
		var originalX = center.x;
		var originalY = center.y - (_outerRadius + this.options.labels.outer.pieDistance);
		var newCoords = math.rotate(originalX, originalY, center.x, center.y, angle);

		// if the label is on the left half of the pie, adjust the values
		var hemisphere = "right"; // hemisphere
		if (angle > 180) {
			newCoords.x -= (labelGroupDims.width + 8);
			hemisphere = "left";
		} else {
			newCoords.x += 8;
		}

		labels.outerLabelGroupData[i] = {
			x: newCoords.x,
			y: newCoords.y,
			w: labelGroupDims.width,
			h: labelGroupDims.height,
			hs: hemisphere
		};
	}
};
	//// --------- segments.js -----------
var segments = {

	isOpening: false,
	currentlyOpenSegment: null,

	/**
	 * Creates the pie chart segments and displays them according to the desired load effect.
	 * @private
	 */
	create: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var pieCenter = pie.pieCenter;
		var data = pie.options.data;
		var colors = pie.options.colors;
		var innerRadius = pie.innerRadius;
		var outerRadius = pie.outerRadius;
		var loadEffects = pie.options.effects.load;
		var totalSize = pie.totalSize;
		var segmentStroke = pie.options.misc.colors.segmentStroke;
		var svg = pie.svg;

		// we insert the pie chart BEFORE the title, to ensure the title overlaps the pie
		var pieChartElement = svg.insert("g", "#" + cssPrefix + "title")
			.attr("transform", function() { return math.getPieTranslateCenter(pieCenter); })
			.attr("class", cssPrefix + "pieChart");

		var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				var angle = (d.value / totalSize) * 2 * Math.PI;
				return angle;
			});

		var g = pieChartElement.selectAll("." + cssPrefix + "arc")
			.data(data)
			.enter()
			.append("g")
			.attr("class", cssPrefix + "arc");

		// if we're not fading in the pie, just set the load speed to 0
		var loadSpeed = loadEffects.speed;
		if (loadEffects.effect === "none") {
			loadSpeed = 0;
		}

		g.append("path")
			.attr("id", function(d, i) { return cssPrefix + "segment" + i; })
			.style("fill", function(d, index) { return colors[index]; })
			.style("stroke", segmentStroke)
			.style("stroke-width", 1)
			.transition()
			.ease("cubic-in-out")
			.duration(loadSpeed)
			.attr("data-index", function(d, i) { return i; })
			.attrTween("d", math.arcTween);

		svg.selectAll("g." + cssPrefix + "arc")
			.attr("transform",
			function(d, i) {
				var angle = 0;
				if (i > 0) {
					angle = segments.getSegmentAngle(i-1, data, totalSize);
				}
				return "rotate(" + angle + ")";
			}
		);

		pie.arc = arc;
	},

	addSegmentEventHandlers: function(cssPrefix) {
		var $arc = $("." + cssPrefix + "arc");
		$arc.on("click", function(e) {
			var $segment = $(e.currentTarget).find("path");
			var isExpanded = $segment.attr("class") === "expanded";

			segments.onSegmentEvent(this.options.callbacks.onClickSegment, $segment, isExpanded);
			if (this.options.effects.pullOutSegmentOnClick.effect !== "none") {
				if (isExpanded) {
					segments.closeSegment($segment[0]);
				} else {
					segments.openSegment($segment[0]);
				}
			}
		});

		$arc.on("mouseover", function(e) {
			var $segment = $(e.currentTarget).find("path");

			if (this.options.effects.highlightSegmentOnMouseover) {
				var index = $segment.data("index");
				var segColor = this.options.colors[index];
				d3.select($segment[0]).style("fill", helpers.getColorShade(segColor, this.options.effects.highlightLuminosity));
			}

			var isExpanded = $segment.attr("class") === "expanded";
			segments.onSegmentEvent(this.options.callbacks.onMouseoverSegment, $segment, isExpanded);
		});

		$arc.on("mouseout", function(e) {
			var $segment = $(e.currentTarget).find("path");

			if (this.options.effects.highlightSegmentOnMouseover) {
				var index = $segment.data("index");
				d3.select($segment[0]).style("fill", this.options.colors[index]);
			}

			var isExpanded = $segment.attr("class") === "expanded";
			segments.onSegmentEvent(this.options.callbacks.onMouseoutSegment, $segment, isExpanded);
		});
	},

	// helper function used to call the click, mouseover, mouseout segment callback functions
	onSegmentEvent: function(func, $segment, isExpanded) {
		if (!$.isFunction(func)) {
			return;
		}
		try {
			var index = parseInt($segment.data("index"), 10);
			func({
				segment: $segment[0],
				index: index,
				expanded: isExpanded,
				data: this.options.data[index]
			});
		} catch(e) { }
	},

	openSegment: function(segment) {
		if (segments.isOpening) {
			return;
		}
		segments.isOpening = true;

		// close any open segments
		if ($(".expanded").length > 0) {
			segments.closeSegment($(".expanded")[0]);
		}

		d3.select(segment).transition()
			.ease(this.options.effects.pullOutSegmentOnClick.effect)
			.duration(this.options.effects.pullOutSegmentOnClick.speed)
			.attr("transform", function(d, i) {
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y),
					pullOutSize = parseInt(this.options.effects.pullOutSegmentOnClick.size, 10);

				return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
			})
			.each("end", function(d, i) {
				segments.currentlyOpenSegment = segment;
				segments.isOpening = false;
				$(this).attr("class", "expanded");
			});
	},

	closeSegment: function(segment) {
		d3.select(segment).transition()
			.duration(400)
			.attr("transform", "translate(0,0)")
			.each("end", function(d, i) {
				$(this).attr("class", "");
				segments.currentlyOpenSegment = null;
			});
	},

	getCentroid: function(el) {
		var bbox = el.getBBox();
		return {
			x: bbox.x + bbox.width / 2,
			y: bbox.y + bbox.height / 2
		};
	},

	/**
	 * General helper function to return a segment's angle, in various different ways.
	 * @param index
	 * @param opts optional object for fine-tuning exactly what you want.
	 */
	getSegmentAngle: function(index, data, totalSize, opts) {
		var options = $.extend({

			// if true, this returns the full angle from the origin. Otherwise it returns the single segment angle
			compounded: true,

			// optionally returns the midpoint of the angle instead of the full angle
			midpoint: false
		}, opts);

		var currValue = data[index].value;

		var fullValue;
		if (options.compounded) {
			fullValue = 0;

			// get all values up to and including the specified index
			for (var i=0; i<=index; i++) {
				fullValue += data[i].value;
			}
		}

		if (typeof fullValue === 'undefined') {
			fullValue = currValue;
		}

		// now convert the full value to an angle
		var angle = (fullValue / this.totalSize) * 360;

		// lastly, if we want the midpoint, factor that sucker in
		if (options.midpoint) {
			var currAngle = (currValue / this.totalSize) * 360;
			angle -= (currAngle / 2);
		}

		return angle;
	},

	getPercentage: function(index) {
		return Math.floor((this.options.data[index].value / this.totalSize) * 100);
	}
};
	//// --------- text.js -----------
var text = {
	offscreenCoord: -10000,

	addTitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var headerLocation = pie.options.header.location;
		var titleInfo = pie.options.header.title;
		var svg = pie.svg;

		var title = svg.selectAll("." + cssPrefix + "title")
			.data([titleInfo])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("id", cssPrefix + "title")
			.attr("class", cssPrefix + "title")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("text-anchor", function() {
				var location;
				if (headerLocation === "top-center" || headerLocation === "pie-center") {
					location = "middle";
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionTitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var pieCenter = pie.pieCenter;
		var textComponents = pie.textComponents;
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var svg = pie.svg;

		var x = (headerLocation === "top-left") ? canvasPadding.left : canvasWidth / 2;
		var y = canvasPadding.top + textComponents.title.h;

		if (headerLocation === "pie-center") {
			y = pieCenter.y;

			// still not fully correct
			if (textComponents.subtitle.exists) {
				var totalTitleHeight = textComponents.title.h + titleSubtitlePadding + textComponents.subtitle.h;
				y = y - (totalTitleHeight / 2) + textComponents.title.h;
			} else {
				y += (textComponents.title.h / 4);
			}
		}

		svg.select("#" + cssPrefix + "title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function(pie) {
		var svg = pie.svg;
		var cssPrefix      = pie.cssPrefix;
		var headerLocation = pie.options.header.location;
		var subtitleInfo   = pie.options.header.subtitle;

		svg.selectAll("." + cssPrefix + "subtitle")
			.data([subtitleInfo])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", cssPrefix + "subtitle")
			.attr("class", cssPrefix + "subtitle")
			.attr("text-anchor", function() {
				var location;
				if (headerLocation === "top-center" || headerLocation === "pie-center") {
					location = "middle";
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionSubtitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var pieCenter = pie.pieCenter;
		var textComponents = pie.textComponents;
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var svg = pie.svg;

		var x = (headerLocation === "top-left") ? canvasPadding.left : canvasWidth / 2;
		var y;
		if (textComponents.title.exists) {
			var totalTitleHeight = textComponents.title.h + titleSubtitlePadding + textComponents.subtitle.h;
			if (headerLocation === "pie-center") {
				y = pieCenter.y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				y = totalTitleHeight;
			}
		} else {
			if (headerLocation === "pie-center") {
				var footerPlusPadding = canvasPadding.bottom + textComponents.footer.h;
				y = ((canvasHeight - footerPlusPadding) / 2) + canvasPadding.top + (textComponents.subtitle.h / 2);
			} else {
				y = canvasPadding.top + textComponents.subtitle.h;
			}
		}
		svg.select("#" + cssPrefix + "subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function(pie) {
		var svg = pie.svg;
		var cssPrefix = pie.cssPrefix;
		var footerSettings = pie.options.footer;

		svg.selectAll("." + cssPrefix + "footer")
			.data([footerSettings])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", cssPrefix + "footer")
			.attr("class", cssPrefix + "footer")
			.attr("text-anchor", function() {
				var location = "left";
				if (footerSettings.location === "bottom-center") {
					location = "middle";
				} else if (footerSettings.location === "bottom-right") {
					location = "left"; // on purpose. We have to change the x-coord to make it properly right-aligned
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionFooter: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var footerLocation = pie.options.footer.location;
		var footerWidth = pie.textComponents.footer.w;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var canvasPadding = pie.options.misc.canvasPadding;
		var svg = pie.svg;

		var x;
		if (footerLocation === "bottom-left") {
			x = canvasPadding.left;
		} else if (footerLocation === "bottom-right") {
			x = canvasWidth - footerWidth - canvasPadding.right;
		} else {
			x = canvasWidth / 2; // TODO - shouldn't this also take into account padding?
		}

		svg.select("#" + cssPrefix + "footer")
			.attr("x", x)
			.attr("y", canvasHeight - canvasPadding.bottom);
	}
};

	// --------------------------------------------------------------------------------------------

	// our constructor
	var d3pie = function(element, options) {

		// element can be an ID or DOM element
		this.element = (typeof element === "string") ? $("#" + element)[0] : element;
		this.options = $.extend(true, {}, defaultSettings, options);

		// if the user specified a custom CSS element prefix (ID, class), use it. Otherwise use the
		if (this.options.misc.cssPrefix !== null) {
			this.cssPrefix = this.options.misc.cssPrefix;
		} else {
			this.cssPrefix = "p" + _uniqueIDCounter + "_";
			_uniqueIDCounter++;
		}

		// now run some validation on the supplied info
		if (!validate.initialCheck(this)) {
			return;
		}

		// add a data-role to the DOM node to let anyone know that it contains a d3pie instance, and the d3pie version
		$(this.element).data(_scriptName, _version);

		_init.call(this);
	};

	d3pie.prototype.recreate = function() {
		this.element.innerHTML = "";
		_init();
	};

	d3pie.prototype.destroy = function() {
		$(this.element).removeData(_scriptName); // remove the data attr
		this.element.innerHTML = ""; // clear out the SVG
	};

	/**
	 * Returns all pertinent info about the current open info. Returns null if nothing's open, or if one is, an object of
	 * the following form:
	 * 	{
	 * 	  element: DOM NODE,
	 * 	  index: N,
	 * 	  data: {}
	 * 	}
	 */
	d3pie.prototype.getOpenPieSegment = function() {
		var segment = segments.currentlyOpenSegment;
		if (segment !== null) {
			var index = parseInt($(segment).data("index"), 10);
			return {
				element: segment,
				index: index,
				data: this.options.data[index]
			}
		} else {
			return null;
		}
	};

	d3pie.prototype.openSegment = function(index) {
		var index = parseInt(index, 10);
		if (index < 0 || index > this.options.data.length-1) {
			return;
		}
		segments.openSegment($("#segment" + index)[0]);
	};

	// this let's the user dynamically update aspects of the pie chart without causing a complete redraw. It
	// intelligently re-renders only the part of the pie that the user specifies. Some things cause a repaint, others
	// just redraw the single element
	d3pie.prototype.updateProp = function(propKey, value, optionalSettings) {
		switch (propKey) {
			case "header.title.text":
				var oldVal = helpers.processObj(this.options, propKey);
				helpers.processObj(this.options, propKey, value);
				$("#title").html(value);
				if ((oldVal === "" && value !== "") || (oldVal !== "" && value === "")) {
					this.recreate();
				}
				break;

			case "header.subtitle.text":
				var oldValue = helpers.processObj(this.options, propKey);
				helpers.processObj(this.options, propKey, value);
				$("#subtitle").html(value);
				if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
					this.recreate();
				}
				break;

			case "callbacks.onload":
			case "callbacks.onMouseoverSegment":
			case "callbacks.onMouseoutSegment":
			case "callbacks.onClickSegment":
			case "effects.pullOutSegmentOnClick.effect":
			case "effects.pullOutSegmentOnClick.speed":
			case "effects.pullOutSegmentOnClick.size":
			case "effects.highlightSegmentOnMouseover":
			case "effects.highlightLuminosity":
				helpers.processObj(this.options, propKey, value);
				break;

		}
	};


	// ------------------------------------------------------------------------------------------------


	var _init = function() {

		// 1. prep-work
		this.options.data   = math.sortPieData(this);
		this.options.colors = helpers.initSegmentColors(this);
		this.totalSize      = math.getTotalPieSize(this.options.data);
		this.svg = helpers.addSVGSpace(this);

		// 2. store info about the main text components as part of the d3pie object instance. This is populated
		this.textComponents = {
			title: {
				exists: this.options.header.title.text !== "",
				h: 0,
				w: 0
			},
			subtitle: {
				exists: this.options.header.subtitle.text !== "",
				h: 0,
				w: 0
			},
			footer: {
				exists: this.options.footer.text !== "",
				h: 0,
				w: 0
			}
		};

		// 3. add the key text components offscreen (title, subtitle, footer). We need to know their widths/heights for later computation
		if (this.textComponents.title.exists) {
			text.addTitle(this);
		}
		if (this.textComponents.subtitle.exists) {
			text.addSubtitle(this);
		}
		text.addFooter(this);

		// the footer never moves - this puts it in place now
		var self = this;
		helpers.whenIdExists(this.cssPrefix + "footer", function() {
			text.positionFooter(self);
			var d3 = helpers.getDimensions(self.cssPrefix + "footer");
			self.textComponents.footer.h = d3.h;
			self.textComponents.footer.w = d3.w;
		});

		math.computePieRadius(this);

		// this value is used all over the place for placing things and calculating locations. We figure it out ONCE
		// and store it as part of the object
		math.calculatePieCenter(this);


		// STEP 2: now create the pie chart and position everything accordingly
		var reqEls = [];
		if (this.textComponents.title.exists)    { reqEls.push(this.cssPrefix + "title"); }
		if (this.textComponents.subtitle.exists) { reqEls.push(this.cssPrefix + "subtitle"); }
		if (this.textComponents.footer.exists)   { reqEls.push(this.cssPrefix + "footer"); }

		helpers.whenElementsExist(reqEls, function() {
			if (self.textComponents.title.exists) {
				var d1 = helpers.getDimensions(self.cssPrefix + "title");
				self.textComponents.title.h = d1.h;
				self.textComponents.title.w = d1.w;
			}
			if (self.textComponents.subtitle.exists) {
				var d2 = helpers.getDimensions(self.cssPrefix + "subtitle");
				self.textComponents.subtitle.h = d2.h;
				self.textComponents.subtitle.w = d2.w;
			}

			// position the title and subtitle
			text.positionTitle(self);
			text.positionSubtitle(self);

			// now create the pie chart segments
			segments.create(self); // also creates this.arc
			labels.add("inner", self);
			labels.add("outer", self.options.labels.outer.format);

			// position the label elements relatively within their individual group (label, percentage, value)
			labels.positionLabelElements("inner", this.options.labels.inner.format);
			labels.positionLabelElements("outer", this.options.labels.outer.format);
			labels.computeOuterLabelCoords();

			// this is (and should be) dumb. It just places the outer groups at their pre-calculated, collision-free positions
			labels.positionLabelGroups("outer");

			// we use the label line positions for many other calculations, so ALWAYS compute them
			labels.computeLabelLinePositions();

			// only add them if they're actually enabled
			if (this.options.labels.lines.enabled && this.options.labels.outer.format !== "none") {
				labels.addLabelLines();
			}

			labels.positionLabelGroups("inner");
			labels.fadeInLabelsAndLines();

			segments.addSegmentEventHandlers();
		});
	};

	// expose our d3pie function
	window.d3pie = d3pie;

})(jQuery);