/*!
 * d3pie jQuery plugin
 * @author Ben Keen
 * @version 0.1.0
 * @date Feb 2014
 * http://github.com/benkeen/d3pie
 */
;(function($, window, document) {
	"use strict";

	/**
 *  --------- defaultSettings.js -----------
 *
 * Contains the out-the-box settings for the script. Any of these settings that aren't explicitly overridden for the
 * d3pie instance will inherit from these.
 */
var _defaultSettings = {
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
		location: "top-left"
	},
	footer: {
		text: ""
	},
	size: {
		canvasHeight: 500,
		canvasWidth: 500,
		pieInnerRadius: "100%",
		pieOuterRadius: null
	},
	labels: {
		enableTooltips: true,
		inside: "none",
		outside: "label",
		mainLabel: {
			color: "#333333",
			font: "Open sans",
			fontSize: "8"
		},
		percentage: {
			color: "#999999",
			font: "Open sans",
			fontSize: "8"
		},
		value: {
			color: "#cccc44",
			font: "Open sans",
			fontSize: "8"
		},
		lines: {
			enabled: true,
			length: 16,
			color: "segment" // "segment" or a hex color
		}
	},
	styles: {
		backgroundColor: null,
		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"]
	},
	effects: {
		load: {
			effect: "default", // none / default
			speed: 1000
		},
		pullOutSegmentOnClick: {
			effect: "linear", // none / linear / bounce /
			speed: 400
		},
		highlightSegmentOnMouseover: false,
		labelFadeInTime: 400
	},
	tooltips: {
		enable: false
	},
	misc: {
//			enableTooltips: false,
//			dataSortOrder: "none",
//			hideLabelsForSmallSegments: false,
//			hideLabelsForSmallSegmentSize: "5%",
//			preventTextSelection: true

		cssPrefix: "auto", //
		dataSortOrder: "none", // none, value-asc, value-desc, label-asc, label-desc, random
		canvasPadding: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		titleSubtitlePadding: 5, // the padding between the title and subtitle
		footerPiePadding: 0,
		textSelectable: false
	},
	callbacks: {
		onload: null,
		onMouseoverSegment: null,
		onMouseoutSegment: null,
		onClickSegment: null
	}
};

	// --------- validate.js -----------
d3pie.validate = {

};
	/**
 *  --------- helpers.js -----------
 *
 * Misc helper functions.
 */
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

	rectIntersect2: function (a, b) {
		return (a.left <= b.right &&
			b.left <= a.right &&
			a.top <= b.bottom &&
			b.top <= a.bottom)
	}
};

	// --------- math.js -----------

/**
 * Contains all the math needed to figure out where to place things, etc.
 */
d3pie.math = {

	toRadians: function(degrees) {
		return degrees * (Math.PI / 180);
	},

	toDegrees: function(radians) {
		return radians * (180 / Math.PI);
	},

	computePieRadius: function() {
		// outer radius is either specified (e.g. through the generator), or omitted altogether
		// and calculated based on the canvas dimensions. Right now the estimated version isn't great - it should
		// be possible to calculate it to precisely generate the maximum sized pie, but it's fussy as heck

		// first, calculate the default _outerRadius
		var w = _options.size.canvasWidth - _options.misc.canvasPadding.left - _options.misc.canvasPadding.right;
		var h = _options.size.canvasHeight; // - headerHeight - _options.misc.canvasPadding.bottom - footerHeight);

		var outerRadius = ((w < h) ? w : h) / 2.8;
		var innerRadius;

		// if the user specified something, use that instead
		if (_options.size.pieOuterRadius !== null) {
			if (/%/.test(_options.size.pieOuterRadius)) {
				var percent = parseInt(_options.size.pieOuterRadius.replace(/[\D]/, ""), 10);
				percent = (percent > 99) ? 99 : percent;
				percent = (percent < 0) ? 0 : percent;
				var smallestDimension = (w < h) ? w : h;
				outerRadius = Math.floor((smallestDimension / 100) * percent) / 2;
			} else {
				// blurgh! TODO bounds checking
				outerRadius = parseInt(_options.size.pieOuterRadius, 10);
			}
		}

		// inner radius
		if (/%/.test(_options.size.pieInnerRadius)) {
			var percent = parseInt(_options.size.pieInnerRadius.replace(/[\D]/, ""), 10);
			percent = (percent > 99) ? 99 : percent;
			percent = (percent < 0) ? 0 : percent;
			innerRadius = Math.floor((outerRadius / 100) * percent);
		} else {
			innerRadius = parseInt(_options.size.pieInnerRadius, 10);
		}

		return {
			inner: innerRadius,
			outer: outerRadius
		};
	},

	getTotalPieSize: function(data) {
		var totalSize = 0;
		for (var i=0; i<data.length; i++) {
			totalSize += data[i].value;
		}
		return totalSize;
	},

	sortPieData: function(data, sortOrder) {
		switch (sortOrder) {
			case "none":
				// do nothing.
				break;
			case "random":
				data = d3pie.helpers.shuffleArray(data);
				break;
			case "value-asc":
				data.sort(function(a, b) { return (a.value < b.value) ? 1 : -1 });
				break;
			case "value-desc":
				data.sort(function(a, b) { return (a.value > b.value) ? 1 : -1 });
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

	getPieTranslateCenter: function() {
		var pieCenter = d3pie.math.getPieCenter();
		return "translate(" + pieCenter.x + "," + pieCenter.y + ")"
	},

	/**
	 * Used to determine where on the canvas the center of the pie chart should be. It takes into account the
	 * height and position of the title, subtitle and footer, and the various paddings.
	 * @private
	 */
	getPieCenter: function() {

		// TODO MEMOIZE (needs invalidation, too)
		var hasTopTitle    = (_hasTitle && _options.header.location !== "pie-center");
		var hasTopSubtitle = (_hasSubtitle && _options.header.location !== "pie-center");

		var headerOffset = _options.misc.canvasPadding.top;
		if (hasTopTitle && hasTopSubtitle) {
			headerOffset += _componentDimensions.title.h + _options.misc.titleSubtitlePadding + _componentDimensions.subtitle.h;
		} else if (hasTopTitle) {
			headerOffset += _componentDimensions.title.h;
		} else if (hasTopSubtitle) {
			headerOffset = _componentDimensions.subtitle.h;
		}

		var footerOffset = 0;
		if (_hasFooter) {
			footerOffset = _componentDimensions.footer.h + _options.misc.canvasPadding.bottom;
		}

		var x = ((_options.size.canvasWidth - _options.misc.canvasPadding.left - _options.misc.canvasPadding.right) / 2) + _options.misc.canvasPadding.left;
		var y = ((_options.size.canvasHeight - footerOffset - headerOffset) / 2) + headerOffset;

		return { x: x, y: y };
	},

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


	// from: http://stackoverflow.com/questions/19792552/d3-put-arc-labels-in-a-pie-chart-if-there-is-enough-space
	pointIsInArc: function(pt, ptData, d3Arc) {
		// Center of the arc is assumed to be 0,0
		// (pt.x, pt.y) are assumed to be relative to the center
		var r1 = d3Arc.innerRadius()(ptData), // Note: Using the innerRadius
			r2 = d3Arc.outerRadius()(ptData),
			theta1 = d3Arc.startAngle()(ptData),
			theta2 = d3Arc.endAngle()(ptData);

		var dist = pt.x * pt.x + pt.y * pt.y,
			angle = Math.atan2(pt.x, -pt.y); // Note: different coordinate system.

		angle = (angle < 0) ? (angle + Math.PI * 2) : angle;

		return (r1 * r1 <= dist) && (dist <= r2 * r2) &&
			(theta1 <= angle) && (angle <= theta2);
	}
};
	// --------- labels.js -----------
d3pie.labels = {

	outerLabelGroupData: [],
	lineCoordGroups: [],

	/**
	 * Adds the labels to the pie chart, but doesn't position them. There are two locations for the
	 * labels: inside (center) of the segments, or outside the segments on the edge.
	 * @param section "inner" or "outer"
	 * @param sectionDisplayType "percentage", "value", "label", "label-value1", etc.
	 */
	add: function(section, sectionDisplayType) {
		var include = d3pie.labels.getIncludes(sectionDisplayType);
		var settings = _options.labels;

		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var outerLabel = _svg.insert("g", ".labels-" + section)
			.attr("class", "labels-" + section);

		var labelGroup = outerLabel.selectAll(".labelGroup-" + section)
			.data(_options.data)
			.enter()
			.append("g")
			.attr("class", "labelGroup-" + section)
			.attr("id", function(d, i) { return "labelGroup" + i + "-" + section; })
			.style("opacity", 0);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("class", "segmentMainLabel-" + section)
				.attr("id", function(d, i) { return "segmentMainLabel" + i + "-" + section; })
				.text(function(d) { return d.label; })
				.style("font-size", settings.mainLabel.fontSize)
				.style("font-family", settings.mainLabel.font)
				.style("fill", settings.mainLabel.color);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("class", "segmentPercentage-" + section)
				.attr("id", function(d, i) { return "segmentPercentage" + i + "-" + section; })
				.text(function(d) {
					return parseInt((d.value / _totalSize) * 100).toFixed(0) + "%"; // TODO
				})
				.style("font-size", settings.percentage.fontSize)
				.style("font-family", settings.percentage.font)
				.style("fill", settings.percentage.color);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("class", "segmentValue-" + section)
				.attr("id", function(d, i) { return "segmentValue" + i + "-" + section; })
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
		d3pie.labels["dimensions-" + section] = [];

		// get the latest widths, heights
		var labelGroups = $(".labelGroup-" + section);

		for (var i=0; i<labelGroups.length; i++) {
			var mainLabel = $(labelGroups[i]).find(".segmentMainLabel-" + section);
			var percentage = $(labelGroups[i]).find(".segmentPercentage-" + section);
			var value = $(labelGroups[i]).find(".segmentValue-" + section);

			d3pie.labels["dimensions-" + section].push({
				mainLabel: (mainLabel.length > 0) ? mainLabel[0].getBBox() : null,
				percentage: (percentage.length > 0) ? percentage[0].getBBox() : null,
				value: (value.length > 0) ? value[0].getBBox() : null
			});
		}

		var singleLinePad = 5;
		var dims = d3pie.labels["dimensions-" + section];
		switch (sectionDisplayType) {
			case "label-value1":
				d3.selectAll(".segmentValue-outer")
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-value2":
				d3.selectAll(".segmentValue-outer")
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
			case "label-percentage1":
				d3.selectAll(".segmentPercentage-outer")
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-percentage2":
				d3.selectAll(".segmentPercentage-outer")
					.attr("dx", function(d, i) { return (dims[i].mainLabel.width / 2) - (dims[i].percentage.width / 2); })
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
	 	}
	},

	computeLabelLinePositions: function() {
		d3pie.labels.lineCoordGroups = [];

		d3.selectAll(".labelGroup-outer")
			.each(function(d, i) { return d3pie.labels.computeLinePosition(i); });
	},

	computeLinePosition: function(i) {
		var angle = d3pie.segments.getSegmentAngle(i, { midpoint: true});
		var center = d3pie.math.getPieCenter();

		var lineLength = _options.labels.lines.length;
		var originCoords = d3pie.math.rotate(center.x, center.y - _outerRadius, center.x, center.y, angle);
		var heightOffset = d3pie.labels.outerLabelGroupData[i].h / 5; // TODO check
		var labelXMargin = 6; // the x-distance of the label from the end of the line [TODO configurable]

		var quarter = Math.floor(angle / 90);
		var midPoint = 4;
		var x2, y2, x3, y3;
		switch (quarter) {
			case 0:
				x2 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin - ((d3pie.labels.outerLabelGroupData[i].x - labelXMargin - originCoords.x) / 2);
				y2 = d3pie.labels.outerLabelGroupData[i].y + ((originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / midPoint);

				x3 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 1:
				x2 = originCoords.x + (d3pie.labels.outerLabelGroupData[i].x - originCoords.x) / 4;
				y2 = d3pie.labels.outerLabelGroupData[i].y - (originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / 4;

				x3 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 2:
				x2 = originCoords.x + (d3pie.labels.outerLabelGroupData[i].x - originCoords.x) / 4;
				y2 = d3pie.labels.outerLabelGroupData[i].y - (originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / 4;

				x3 = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 3:
				x2 = originCoords.x + (d3pie.labels.outerLabelGroupData[i].x - originCoords.x) / 4;
				y2 = d3pie.labels.outerLabelGroupData[i].y - (originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / 4;

				x3 = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
		}

		/*
		 * x1 / y1: the x/y coords of the start of the line, at the mid point of the segments arc on the pie circumference
		 * x2 / y2: the midpoint of the line
		 * x3 / y3: the end of the line; closest point to the label
		 */
		d3pie.labels.lineCoordGroups[i] = [
			{ x: originCoords.x, y: originCoords.y },
			//{ x: x2, y: y2 },
			{ x: x3, y: y3 }
		];

		/*
		switch (quarter) {
			case 0:
				var xCalc1 = Math.sin(d3pie.math.toRadians(remainderAngle));
				x2     = xCalc1 * (_outerRadius + lineMidPointDistance);
				var yCalc1 = Math.cos(d3pie.math.toRadians(remainderAngle));
				y2     = -yCalc1 * (_outerRadius + lineMidPointDistance) + yOffset;
				break;

			case 1:
				var xCalc2 = Math.cos(d3pie.math.toRadians(remainderAngle));
				x2     = xCalc2 * (_outerRadius + lineMidPointDistance);
				var yCalc2 = Math.sin(d3pie.math.toRadians(remainderAngle));
				y2     = yCalc2 * (_outerRadius + lineMidPointDistance) + yOffset;
				break;

			case 2:
				var xCalc3 = Math.sin(d3pie.math.toRadians(remainderAngle));
				x2     = -xCalc3 * (_outerRadius + lineMidPointDistance);
				var yCalc3 = Math.cos(d3pie.math.toRadians(remainderAngle));
				y2     = yCalc3 * (_outerRadius + lineMidPointDistance) + yOffset;
				break;

			case 3:
				var xCalc4 = Math.cos(d3pie.math.toRadians(remainderAngle));
				x2     = -xCalc4 * (_outerRadius + lineMidPointDistance);
				var calc4 = Math.sin(d3pie.math.toRadians(remainderAngle));
				y2     = -calc4 * (_outerRadius + lineMidPointDistance) + yOffset;
				break;
		}
		*/
	},

	addLabelLines: function() {
		var lineGroups = _svg.insert("g", ".pieChart") // meaning, BEFORE .pieChart
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(d3pie.labels.lineCoordGroups)
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
				return (_options.labels.lines.color === "segment") ? _options.styles.colors[i] : _options.labels.lines.color;
			})
			.attr("stroke-width", 1)
			.attr("fill", "none");
	},

	positionLabelGroups: function(section) {
		d3.selectAll(".labelGroup-" + section)
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				var x, y;
				if (section === "outer") {
					x = d3pie.labels.outerLabelGroupData[i].x;
					y = d3pie.labels.outerLabelGroupData[i].y;
				} else {
					var center = d3pie.segments.getCentroid(document.getElementById("segment" + i));
					//console.log(i, _options.data, _totalSize);
					var rotationAngle = d3pie.segments.getSegmentAngle(i);
//					var center = d3pie.math.getPieCenter();
					var diff = (_outerRadius - _innerRadius) / 2;
					x = (d3pie.labels.lineCoordGroups[i][0].x / 2) + center.x;
					y = (d3pie.labels.lineCoordGroups[i][0].y / 2) + center.y;
				}

				return "translate(" + x + "," + y + ")";
			});
	},


	fadeInLabelsAndLines: function() {

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;

			d3.selectAll(".labelGroup-outer,.labelGroup-inner")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);

			d3.selectAll("g.lineGroups")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);

			// once everything's done loading, trigger the onload callback if defined
			if ($.isFunction(_options.callbacks.onload)) {
				setTimeout(function() {
					try {
						_options.callbacks.onload();
					} catch (e) { }
				}, labelFadeInTime);
			}
		}, loadSpeed);
	},

	getIncludes: function(val) {
		var addMainLabel  = false;
		var addValue      = false;
		var addPercentage = false;

		// TODO refactor... somehow.
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
			.each(function(d, i) { return d3pie.labels.getIdealOuterLabelPositions(i); });

		// 2. now adjust those positions to try to accommodate conflicts
		d3pie.labels.resolveOuterLabelCollisions();
	},

	/**
	 * This attempts to resolve label positioning collisions.
	 */
	resolveOuterLabelCollisions: function() {
		var size = _options.data.length;
		d3pie.labels.checkConflict(0, "clockwise", size);
		d3pie.labels.checkConflict(size-1, "anticlockwise", size);
	},

	checkConflict: function(currIndex, direction, size) {
		var currIndexHemisphere = d3pie.labels.outerLabelGroupData[currIndex].hs;
		if (direction === "clockwise" && currIndexHemisphere != "right") {
			return;
		}
		if (direction === "anticlockwise" && currIndexHemisphere != "left") {
			return;
		}
		var nextIndex = (direction === "clockwise") ? currIndex+1 : currIndex-1;

		// this is the current label group being looked at. We KNOW it's positioned properly (the first item
		// is always correct)
		var currLabelGroup = d3pie.labels.outerLabelGroupData[currIndex];

		// this one we don't know about. That's the one we're going to look at and move if necessary
		var examinedLabelGroup = d3pie.labels.outerLabelGroupData[nextIndex];

		var info = {
			labelHeights: d3pie.labels.outerLabelGroupData[0].h,
			center: d3pie.math.getPieCenter(),
			lineLength: (_outerRadius + _options.labels.lines.length),
			heightChange: d3pie.labels.outerLabelGroupData[0].h + 1 // 1 = padding
		};

		// loop through *ALL* label groups examined so far to check for conflicts. This is because when they're
		// very tightly fitted, a later label group may still appear high up on the page
		if (direction === "clockwise") {
			for (var i=0; i<=currIndex; i++) {
				var curr = d3pie.labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (d3pie.helpers.rectIntersect(curr, examinedLabelGroup)) {
					d3pie.labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		} else {
			for (var i=size-1; i>=currIndex; i--) {
				var curr = d3pie.labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (d3pie.helpers.rectIntersect(curr, examinedLabelGroup)) {
					d3pie.labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		}
		d3pie.labels.checkConflict(nextIndex, direction, size);
	},

	// does a little math to shift a label into a new position based on the last properly placed one
	adjustLabelPos: function(nextIndex, lastCorrectlyPositionedLabel, info) {
		var xDiff, yDiff, newXPos, newYPos;
		newYPos = lastCorrectlyPositionedLabel.y + info.heightChange;
		yDiff = info.center.y - newYPos;

		if (Math.abs(info.lineLength) > Math.abs(yDiff)) {
			xDiff = Math.sqrt((info.lineLength * info.lineLength) - (yDiff * yDiff));
		} else {
			xDiff = Math.sqrt((yDiff * yDiff) - (info.lineLength * info.lineLength));
		}

		// ahhh! info.lineLength is no longer a constant.....

		if (lastCorrectlyPositionedLabel.hs === "right") {
			newXPos = info.center.x + xDiff;
		} else {
			newXPos = info.center.x - xDiff - d3pie.labels.outerLabelGroupData[nextIndex].w;
		}

		if (!newXPos) {
			console.log(lastCorrectlyPositionedLabel.hs, xDiff)
		}

		d3pie.labels.outerLabelGroupData[nextIndex].x = newXPos;
		d3pie.labels.outerLabelGroupData[nextIndex].y = newYPos;
	},

	/**
	 * @param i 0-N where N is the dataset size - 1.
	 */
	getIdealOuterLabelPositions: function(i) {
		var labelGroupDims = document.getElementById("labelGroup" + i + "-outer").getBBox();
		var angle = d3pie.segments.getSegmentAngle(i, { midpoint: true });

		var center = d3pie.math.getPieCenter();
		var originalX = center.x;
		var originalY = center.y - (_outerRadius + _options.labels.lines.length);
		var newCoords = d3pie.math.rotate(originalX, originalY, center.x, center.y, angle);

		// if the label is on the left half of the pie, adjust the values
		var hemisphere = "right"; // hemisphere
		if (angle > 180) {
			newCoords.x -= (labelGroupDims.width + 8);
			hemisphere = "left";
		} else {
			newCoords.x += 8;
		}

		d3pie.labels.outerLabelGroupData[i] = {
			x: newCoords.x,
			y: newCoords.y,
			w: labelGroupDims.width,
			h: labelGroupDims.height,
			hs: hemisphere
		};
	}
};
	// --------- segments.js -----------
d3pie.segments = {

	currentlyOpenSegment: null,

	/**
	 * Creates the pie chart segments and displays them according to the selected load effect.
	 * @param element
	 * @param options
	 * @private
	 */
	create: function() {

		// we insert the pie chart BEFORE the title, to ensure the title overlaps the pie
		var pieChartElement = _svg.insert("g", "#title")
			.attr("transform", d3pie.math.getPieTranslateCenter)
			.attr("class", "pieChart");

		_arc = d3.svg.arc()
			.innerRadius(_innerRadius)
			.outerRadius(_outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				var angle = (d.value / _totalSize) * 2 * Math.PI;
				return angle;
			});

		var g = pieChartElement.selectAll(".arc")
			.data(_options.data)
			.enter()
			.append("g")
			.attr("class", function() {
				var className = "arc";
				if (_options.effects.highlightSegmentOnMouseover) {
					className += " arcHover";
				}
				return className;
			});

		// if we're not fading in the pie, just set the load speed to 0
		var loadSpeed = _options.effects.load.speed;
		if (_options.effects.load.effect === "none") {
			loadSpeed = 0;
		}

		g.append("path")
			.attr("id", function(d, i) { return "segment" + i; })
			.style("fill", function(d, index) { return _options.styles.colors[index]; })
			.style("stroke", "#ffffff")
			.style("stroke-width", 1)
			.transition()
			.ease("cubic-in-out")
			.duration(loadSpeed)
			.attr("data-index", function(d, i) { return i; })
			.attrTween("d", d3pie.math.arcTween);

		_svg.selectAll("g.arc")
			.attr("transform",
			function(d, i) {
				var angle = 0;
				if (i > 0) {
					i = i-1;
					angle = d3pie.segments.getSegmentAngle(i);
				}
				return "rotate(" + angle + ")";
			}
		);
	},

	addSegmentEventHandlers: function() {
		var $arc = $(".arc");
		$arc.on("click", function(e) {
			var $segment = $(e.currentTarget).find("path");
			var isExpanded = $segment.attr("class") === "expanded";

			d3pie.segments.onSegmentEvent(_options.callbacks.onClickSegment, $segment, isExpanded);

			if (_options.effects.pullOutSegmentOnClick.effect !== "none") {
				if (isExpanded) {
					d3pie.segments.closeSegment($segment[0]);
				} else {
					d3pie.segments.openSegment($segment[0]);
				}
			}
		});

		$arc.on("mouseover", function(e) {
			var $segment = $(e.currentTarget).find("path");
			var isExpanded = $segment.attr("class") === "expanded";
			d3pie.segments.onSegmentEvent(_options.callbacks.onMouseoverSegment, $segment, isExpanded);
		});

		$arc.on("mouseout", function(e) {
			var $segment = $(e.currentTarget).find("path");
			var isExpanded = $segment.attr("class") === "expanded";
			d3pie.segments.onSegmentEvent(_options.callbacks.onMouseoutSegment, $segment, isExpanded);
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
				data: _options.data[index]
			});
		} catch(e) { }
	},

	openSegment: function(segment) {

		// close any open segments
		if ($(".expanded").length > 0) {
			d3pie.segments.closeSegment($(".expanded")[0]);
		}

		d3.select(segment).transition()
			.ease(_options.effects.pullOutSegmentOnClick.effect)
			.duration(_options.effects.pullOutSegmentOnClick.speed)
			.attr("transform", function(d, i) {
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y),
					pullOutSize = 8;

				return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
			})
			.each("end", function(d, i) {
				d3pie.segments.currentlyOpenSegment = segment;
				$(this).attr("class", "expanded");
			});
	},

	closeSegment: function(segment) {
		d3.select(segment).transition()
			.duration(400)
			.attr("transform", "translate(0,0)")
			.each("end", function(d, i) {
				$(this).attr("class", "");
				d3pie.segments.currentlyOpenSegment = null;
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
	getSegmentAngle: function(index, opts) {
		var options = $.extend({

			// if true, this returns the full angle from the origin. Otherwise it returns the single segment angle
			compounded: true,

			// optionally returns the midpoint of the angle instead of the full angle
			midpoint: false
		}, opts);

		var currValue = _options.data[index].value;

		var fullValue;
		if (options.compounded) {
			fullValue = 0;

			// get all values up to and including the specified index
			for (var i=0; i<=index; i++) {
				fullValue += _options.data[i].value;
			}
		}

		if (typeof fullValue === 'undefined') {
			fullValue = currValue;
		}

		// now convert the full value to an angle
		var angle = (fullValue / _totalSize) * 360;

		// lastly, if we want the midpoint, factor that sucker in
		if (options.midpoint) {
			var currAngle = (currValue / _totalSize) * 360;
			angle -= (currAngle / 2);
		}

		return angle;
	}

};
	// --------- text.js -----------

/**
 * Contains the code pertaining to the
 */
d3pie.text = {

	offscreenCoord: -10000,


	addTextElementsOffscreen: function() {
		if (_hasTitle) {
			d3pie.text.addTitle();
		}
		if (_hasSubtitle) {
			d3pie.text.addSubtitle();
		}
	},

	/**
	 * Adds the Pie Chart title.
	 * @param titleData
	 * @private
	 */
	addTitle: function() {
		var title = _svg.selectAll(".title").data([_options.header.title]);
		title.enter()
			.append("text")
			.attr("id", "title")
			.attr("x", d3pie.text.offscreenCoord)
			.attr("y", d3pie.text.offscreenCoord)
			.attr("class", "title")
			.attr("text-anchor", function() {
				var location;
				if (_options.header.location === "top-center" || _options.header.location === "pie-center") {
					location = "middle";
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionTitle: function() {
		var x = (_options.header.location === "top-left") ? _options.misc.canvasPadding.left : _options.size.canvasWidth / 2;
		var y = _options.misc.canvasPadding.top + _componentDimensions.title.h;

		if (_options.header.location === "pie-center") {
			var pieCenter = d3pie.math.getPieCenter();
			y = pieCenter.y;

			// still not fully correct.
			if (_hasSubtitle) {
				var totalTitleHeight = _componentDimensions.title.h + _options.misc.titleSubtitlePadding + _componentDimensions.subtitle.h;
				y = y - (totalTitleHeight / 2) + _componentDimensions.title.h;
			} else {
				y += (_componentDimensions.title.h / 4);
			}
		}

		_svg.select("#title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function() {
		if (!_hasSubtitle) {
			return;
		}

		_svg.selectAll(".subtitle")
			.data([_options.header.subtitle])
			.enter()
			.append("text")
			.attr("x", d3pie.text.offscreenCoord)
			.attr("y", d3pie.text.offscreenCoord)
			.attr("id", "subtitle")
			.attr("class", "subtitle")
			.attr("text-anchor", function() {
				var location;
				if (_options.header.location === "top-center" || _options.header.location === "pie-center") {
					location = "middle";
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionSubtitle: function() {
		var x = (_options.header.location === "top-left") ? _options.misc.canvasPadding.left : _options.size.canvasWidth / 2;

		var y;
		if (_hasTitle) {
			var totalTitleHeight = _componentDimensions.title.h + _options.misc.titleSubtitlePadding + _componentDimensions.subtitle.h;
			if (_options.header.location === "pie-center") {
				var pieCenter = d3pie.math.getPieCenter();
				y = pieCenter.y;
				y = y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				y = totalTitleHeight;
			}
		} else {
			if (_options.header.location === "pie-center") {
				var footerPlusPadding = _options.misc.canvasPadding.bottom + _componentDimensions.footer.h;
				y = ((_options.size.canvasHeight - footerPlusPadding) / 2) + _options.misc.canvasPadding.top + (_componentDimensions.subtitle.h / 2);
			} else {
				y = _options.misc.canvasPadding.top + _componentDimensions.subtitle.h;
			}
		}

		_svg.select("#subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function() {
		_svg.selectAll(".footer")
			.data([_options.footer])
			.enter()
			.append("text")
			.attr("x", d3pie.text.offscreenCoord)
			.attr("y", d3pie.text.offscreenCoord)
			.attr("id", "footer")
			.attr("class", "footer")
			.attr("text-anchor", function() {
				var location;
				if (_options.footer.location === "bottom-center") {
					location = "middle";
				} else if (_options.footer.location === "bottom-right") {
					location = "left"; // on purpose. We have to change the x-coord to make it properly right-aligned
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });

		d3pie.helpers.whenIdExists("footer", d3pie.text.positionFooter);
	},

	positionFooter: function() {
		var x;
		if (_options.footer.location === "bottom-left") {
			x = _options.misc.canvasPadding.left;
		} else if (_options.footer.location === "bottom-right") {
			x = _options.size.canvasWidth - _componentDimensions.footer.w - _options.misc.canvasPadding.right;
		} else {
			x = _options.size.canvasWidth / 2;
		}

		var d3 = d3pie.helpers.getDimensions("footer");
		_componentDimensions.footer.h = d3.h;
		_componentDimensions.footer.w = d3.w;

//		console.log(_options.size.canvasHeight - _options.misc.canvasPadding.bottom);
//		console.log(_componentDimensions.footer);

		_svg.select("#footer")
			.attr("x", x)
			.attr("y", _options.size.canvasHeight - _options.misc.canvasPadding.bottom);
	}
};
	/**
 * --------- core.js -----------
 *
 * This contains the main control flow for the script, and all the core jQuery functionality - public + private.
 */
var _pluginName = "d3pie";
var _componentDimensions = {
	title:    { h: 0, w: 0 },
	subtitle: { h: 0, w: 0 },
	footer:   { h: 0, w: 0 }
};
var _hasTitle = false;
var _hasSubtitle = false;
var _hasFooter = false;
var _totalSize = null;
var _arc, _svg, _options, _innerRadius, _outerRadius;

function d3pie(element, options) {
	this.element = element;
	this.options = $.extend(true, {}, _defaultSettings, options);

	// confirm d3 is available [check minimum version]
	if (!window.d3 || !window.d3.hasOwnProperty("version")) {
		console.error("d3pie error: d3 is not available");
		return;
	}

	// validate here

	this._defaults = _defaultSettings;
	this._name = _pluginName;

	// now initialize the thing
	this.init();
}

// prevents multiple instantiations of the same plugin on the same element
$.fn[_pluginName] = function(options) {
	return this.each(function() {
		if (!$.data(this, _pluginName)) {
			$.data(this, _pluginName, new d3pie(this, options));
		}
	});
};


// ----- public functions -----

d3pie.prototype.destroy = function() {
	$(this.element).removeData(_pluginName); // remove the data attr
	$(this.element).html(""); // clear out the SVG
	//delete this.options;
};

d3pie.prototype.recreate = function() {
	$(this.element).html("");
	this.init();
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
	var segment = d3pie.segments.currentlyOpenSegment;
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
	// TODO error checking
	var index = parseInt(index, 10);
	if (index < 0 || index > this.options.data.length-1) {
		return;
	}

	d3pie.segments.openSegment($("#segment" + index)[0]);
};


// this let's the user dynamically update aspects of the pie chart without causing a complete redraw. It
// intelligently re-renders only the part of the pie that the user specifies. Some things cause a repaint, others
// just redraw the single element
d3pie.prototype.updateProp = function(propKey, value, optionalSettings) {
	switch (propKey) {
		case "header.title.text":
			var oldValue = d3pie.helpers.processObj(this.options, propKey);
			d3pie.helpers.processObj(this.options, propKey, value);
			$("#title").html(value);
			if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
				this.recreate();
			}
			break;

		case "header.subtitle.text":
			var oldValue = d3pie.helpers.processObj(this.options, propKey);
			d3pie.helpers.processObj(this.options, propKey, value);
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
			d3pie.helpers.processObj(this.options, propKey, value);
			break;

	}
};



d3pie.prototype.init = function() {
	_options = this.options;

	// 1. Prep-work
	_options.data = d3pie.math.sortPieData(_options.data, _options.misc.dataSortOrder);
	_totalSize    = d3pie.math.getTotalPieSize(_options.data);

	d3pie.helpers.addSVGSpace(this.element, _options.size.canvasWidth, _options.size.canvasHeight, _options.styles.backgroundColor);

	// these are used all over the place
	_hasTitle    = _options.header.title.text !== "";
	_hasSubtitle = _options.header.subtitle.text !== "";
	_hasFooter   = _options.footer.text !== "";

	// 2. add all text components offscreen. We need to know their widths/heights for later computation
	d3pie.text.addTextElementsOffscreen();
	d3pie.text.addFooter(); // the footer never moves - just put it in place now

	// TODO this just computes the max available space. Later functionality looks at label size to finish
	// the computation. RENAME. Also, we shouldn't need inner at this stage.
	var radii = d3pie.math.computePieRadius();
	_innerRadius = radii.inner;
	_outerRadius = radii.outer;


	// STEP 2: now create the pie chart and position everything accordingly
	var requiredElements = [];
	if (_hasTitle)    { requiredElements.push("title"); }
	if (_hasSubtitle) { requiredElements.push("subtitle"); }
	if (_hasFooter)   { requiredElements.push("footer"); }

	d3pie.helpers.whenElementsExist(requiredElements, function() {
		_storeDimensions();

		d3pie.text.positionTitle();
		d3pie.text.positionSubtitle();

		d3pie.segments.create();
		var l = d3pie.labels;
		l.add("inner", _options.labels.inside);
		l.add("outer", _options.labels.outside);

		// position the label elements relatively within their individual group (label, percentage, value)
		l.positionLabelElements("inner", _options.labels.inside);
		l.positionLabelElements("outer", _options.labels.outside);

		l.computeOuterLabelCoords();

		// this is (and should be) dumb. It just places the outer groups at their calculated, collision-free positions.
		l.positionLabelGroups("outer");

		if (_options.labels.lines.enabled && _options.labels.outside !== "none") {
			l.computeLabelLinePositions();
			l.addLabelLines();
		}

//		setTimeout(function() { l.positionLabelGroups("inner"); }, 100);

		l.fadeInLabelsAndLines();

		d3pie.segments.addSegmentEventHandlers();

//		setTimeout(function() {
//			d3pie.labels.funWithForces();
//		}, 2000);
	});
};


var _storeDimensions = function() {
	if (_hasTitle) {
		var d1 = d3pie.helpers.getDimensions("title");
		_componentDimensions.title.h = d1.h;
		_componentDimensions.title.w = d1.w;
	}
	if (_hasSubtitle) {
		var d2 = d3pie.helpers.getDimensions("subtitle");
		_componentDimensions.subtitle.h = d2.h;
		_componentDimensions.subtitle.w = d2.w;
	}
};


var _addFilter = function() {
	//_svg.append('<filter id="testBlur"><feDiffuseLighting in="SourceGraphic" result="light" lighting-color="white"><fePointLight x="150" y="60" z="20" /></feDiffuseLighting><feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/></filter>')
};


})(jQuery, window, document);