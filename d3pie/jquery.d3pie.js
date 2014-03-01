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

	getSegmentRotationAngle: function(index, data, totalSize) {
		var val = 0;
		for (var i=0; i<index; i++) {
			try {
				val += data[i].value;
			} catch (e) {
				console.error("error in _getSegmentRotationAngle:", data, i);
			}
		}
		return (val / totalSize) * 360;
	}
};
	// --------- labels.js -----------
d3pie.labels = {

	circleCoordGroups: [],
	dimensions: [],

	/**
	 * Add the outer labels to the pie. Un-positioned.
	 */
	addOuter: function() {
		var include = d3pie.labels.getIncludes(_options.labels.outside);

		// group the label groups into a single element (just for tidiness)
		var outerLabel = _svg.insert("g", ".outerLabel")
			.attr("class", "outerLabel");

		var labelGroup = outerLabel.selectAll(".outerLabelGroup")
			.data(
				_options.data.filter(function(d) { return d.value; }),
				function(d) { return d.label; }
			)
			.enter()
			.append("g")
			.attr("class", "outerLabelGroup")
			.attr("id", function(d, i) { return "outerLabelGroup" + i; })
			.attr("transform", d3pie.math.getPieTranslateCenter)
			.style("opacity", 0);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("class", "segmentOuterMainLabel")
				.attr("id", function(d, i) { return "labelMain" + i; })
				.text(function(d) { return d.label; })
				.style("font-size", _options.labels.mainLabel.fontSize)
				.style("font-family", _options.labels.mainLabel.font)
				.style("fill", _options.labels.mainLabel.color);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("class", "segmentOuterPercentage")
				.attr("id", function(d, i) { return "labelPercentage" + i; })
				.text(function(d) {
					return parseInt((d.value / _totalSize) * 100).toFixed(0) + "%";
				})
				.style("font-size", _options.labels.percentage.fontSize)
				.style("font-family", _options.labels.percentage.font)
				.style("fill", _options.labels.percentage.color);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("class", "segmentOuterValue")
				.attr("id", function(d, i) { return "labelValue" + i; })
				.text(function(d) { return d.value; })
				.style("font-size", _options.labels.value.fontSize)
				.style("font-family", _options.labels.value.font)
				.style("fill", _options.labels.value.color);
		}
	},

	/**
	 * Add the inner labels to the pie. Un-positioned.
	 */
	addInner: function() {
		var include = d3pie.labels.getIncludes(_options.labels.inside);

		// group the label groups into a single element (just for tidiness)
		var outerLabel = _svg.insert("g", ".innerLabel")
			.attr("class", "innerLabel");
	},

	positionOuterLabelElementsRelatively: function() {

		d3pie.labels.dimensions = [];

		// get the latest widths, heights
		var outerLabelGroups = $(".outerLabelGroup");
		for (var i=0; i<outerLabelGroups.length; i++) {
			var row = {};
			var mainLabel = $(outerLabelGroups[i]).find(".segmentOuterMainLabel");
			row.outerMainLabel = (mainLabel.length > 0) ? row.outerMainLabel = mainLabel[0].getBBox() : null;

			var percentage = $(outerLabelGroups[i]).find(".segmentOuterPercentage");
			row.outerPercentage = (percentage.length > 0) ? row.outerPercentage = percentage[0].getBBox() : null;

			var value = $(outerLabelGroups[i]).find(".segmentOuterValue");
			row.outerValue = (value.length > 0) ? row.outerValue = value[0].getBBox() : null;

			d3pie.labels.dimensions.push(row);
		}

		//if (label-value1)
//
//		outerMainLabel:  null,
//		outerPercentage: null,
//		outerValue:      null


	},

	// this both adds the lines
	addLabelLines: function() {
		if (!_options.labels.lines.enabled || _options.labels.outside === "none") {
			return;
		}

		// reset
		d3pie.labels.circleCoordGroups = [];

		d3.selectAll(".outerLabelGroup")
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				return d3pie.labels.getLabelGroupTransform(d, i);
			});

		var lineGroups = _svg.insert("g", ".pieChart")
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(d3pie.labels.circleCoordGroups)
			.enter()
			.append("g")
			.attr("class", "lineGroup")
			.attr("transform", d3pie.math.getPieTranslateCenter);

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", function(d, i) {
				var color;
				if (_options.labels.lines.color === "segment") {
					color = _options.styles.colors[i];
				} else {
					color = _options.labels.lines.color;
				}
				return color;
			})
			.attr("stroke-width", 1)
			.attr("fill", "none");
	},

	fadeInLabelsAndLines: function() {
		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;

			d3.selectAll(".outerLabelGroup")
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


	getLabelGroupTransform: function(d, i) {
		var labelDimensions = document.getElementById("outerLabelGroup" + i).getBBox();
		var lineMidPointDistance = _options.labels.lines.length - (_options.labels.lines.length / 4);
		var angle = d3pie.math.getSegmentRotationAngle(i, _options.data, _totalSize);
		var nextAngle = 360;
		if (i < _options.data.length - 1) {
			nextAngle = d3pie.math.getSegmentRotationAngle(i+1, _options.data, _totalSize);
		}
		var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
		var remainderAngle = segmentCenterAngle % 90;
		var quarter = Math.floor(segmentCenterAngle / 90);

		var labelXMargin = 10; // the x-distance of the label from the end of the line [TODO configurable?]
		var xOffset = (_options.data[i].xOffset) ? _options.data[i].xOffset : 0;
		var heightOffset = labelDimensions.height / 5;
		var yOffset = (_options.data[i].yOffset) ? _options.data[i].yOffset : 0;

		var x1, x2, x3, groupX, y1, y2, y3, groupY;
		switch (quarter) {
			case 0:
				var xCalc1 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc1 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
				x1     = xCalc1 * _outerRadius;
				x2     = xCalc1 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = xCalc1 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;

				var yCalc1 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = -yCalc1 * (_outerRadius + _options.labels.lines.length);
				y1     = -yCalc1 * _outerRadius;
				y2     = -yCalc1 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = -yCalc1 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 1:
				var xCalc2 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc2 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
				x1     = xCalc2 * _outerRadius;
				x2     = xCalc2 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = xCalc2 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;

				var yCalc2 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc2 * (_outerRadius + _options.labels.lines.length);
				y1     = yCalc2 * _outerRadius;
				y2     = yCalc2 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc2 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 2:
				var xCalc3 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc3 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
				x1     = -xCalc3 * _outerRadius;
				x2     = -xCalc3 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = -xCalc3 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;

				var yCalc3 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc3 * (_outerRadius + _options.labels.lines.length);
				y1     = yCalc3 * _outerRadius;
				y2     = yCalc3 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc3 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 3:
				var xCalc4 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc4 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
				x1     = -xCalc4 * _outerRadius;
				x2     = -xCalc4 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = -xCalc4 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;

				var calc4 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = -calc4 * (_outerRadius + _options.labels.lines.length);
				y1     = -calc4 * _outerRadius;
				y2     = -calc4 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = -calc4 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;
		}

		d3pie.labels.circleCoordGroups[i] = [
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 }
		];

		groupX += xOffset;
		groupY += yOffset;

		var center = d3pie.math.getPieCenter();
		groupX += center.x;
		groupY += center.y;

		return "translate(" + groupX + "," + groupY + ")";
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
			.data(
				_options.data.filter(function(d) { return d.value; }),
				function(d) { return d.label; }
			)
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
				var angle = d3pie.math.getSegmentRotationAngle(i, _options.data, _totalSize);
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
	_totalSize = d3pie.math.getTotalPieSize(_options.data);

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
		d3pie.labels.addInner();
		d3pie.labels.addOuter();

		// now place the labels in reasonable locations. This needs to run in a timeout because we need the actual
		// text elements in place
		setTimeout(d3pie.labels.addLabelLines, 1);

		d3pie.labels.positionOuterLabelElementsRelatively();
		d3pie.labels.fadeInLabelsAndLines();

		d3pie.segments.addSegmentEventHandlers();
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