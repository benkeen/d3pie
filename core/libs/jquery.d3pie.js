/*!
 * d3pie jQuery plugin
 * @author Ben Keen
 * @version 0.1.0
 * @date Dec 2013
 * http://github.com/benkeen/d3pie
 *
 * TODO:
 * - need to allow multiple pies per page
 * - prefix all classes and allow it to be customized
 */
;(function($, window, document) {
	"use strict";

	var _pluginName = "d3pie";
	var _defaultSettings = {
		title: {
			location: "top-left",
			color:    "#333333",
			fontSize: "14px",
			font:     "helvetica"
		},
		size: {
			canvasHeight: 500,
			canvasWidth: 500,
			pieInnerRadius: "100%",
			pieOuterRadius: null
		},
		labels: {
			location: "inside",
			format: "{L} {%}",
			enableTooltips: false
		},
		styles: {
			backgroundColor: null,
			colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"]
		},
		effects: {
			loadEffect: "none",
			loadEffectSpeed: 1000,
			highlightSegmentOnMouseover: false,
			pullOutSegmentOnClick: false,
			labelFadeInTime: 400
		},
		misc: {
			enableTooltips: false,
			orderData: "hightolow",
			hideLabelsForSmallSegments: false,
			hideLabelsForSmallSegmentSize: "0%"
		}
	};

	// our constructor
	function d3pie(element, options) {
		this.element = element;
		this.options = $.extend({}, _defaultSettings, options);

		// confirm d3 is available [check minimum version]
		if (!window.d3 || !window.d3.hasOwnProperty("version")) {
			console.error("d3pie error: d3 is not available");
			return;
		}

		// TODO confirm the required parameters have been set

		// TODO format all colours so they begin with #

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

		// remove the data attr
		$(this.element).removeData(_pluginName);

		// clear out the SVG
		$(this.element).html("");

		// what the heck
		delete this.options;
	};


	// ----- private functions -----


	// TODO these are temporary. They'll need to attach to the instance, I think. Either way, this is feeling very klutzy
	var _arc, _svg, _totalSize, _data, _innerRadius, _outerRadius, _options;

	d3pie.prototype.init = function() {

		// store the options in a local var for circumventing any "this" nonsense
		_options = this.options;
		_data      = this.options.data;
		_totalSize = _getTotalPieSize(_data);

		// outer radius is either specified (e.g. through the generator), or omitted altogether
		// and calculated based on the canvas dimensions. Right now the estimated version isn't great - it should
		// be possible to calculate it to precisely generate the maximum sized pie, but it's fussy as heck

		// first, calculate the default _outerRadius
		var w = _options.size.canvasWidth;
		var h = _options.size.canvasHeight;
		_outerRadius = ((w < h) ? w : h) / 2.8;

		// if the user specified something, use that instead
		if (_options.size.pieOuterRadius !== null) {
			if (/%/.test(_options.size.pieOuterRadius)) {
				var percent = parseInt(_options.size.pieOuterRadius.replace(/[\D]/, ""), 10);
				percent = (percent > 99) ? 99 : percent;
				percent = (percent < 0) ? 0 : percent;
				var smallestDimension = (w < h) ? w : h;
				_outerRadius = Math.floor((smallestDimension / 100) * percent) / 2;
			} else {
				// blurgh! TODO bounds checking
				_outerRadius = parseInt(_options.size.pieOuterRadius, 10);
			}
		}

		// inner radius
		if (/%/.test(_options.styles.pieInnerRadius)) {
			var percent = parseInt(_options.styles.pieInnerRadius.replace(/[\D]/, ""), 10);
			percent = (percent > 99) ? 99 : percent;
			percent = (percent < 0) ? 0 : percent;
			_innerRadius = Math.floor((_outerRadius / 100) * percent);
		} else {
			_innerRadius = parseInt(_options.styles.pieInnerRadius, 10);
		}

		_addSVGSpace(this.element);
		_addTitle(_options.title);
		_createPie(this.element);
		_addLabels();
		_addSegmentEventHandlers();
	};

	// creates the SVG element
	var _addSVGSpace = function(element) {
		_svg = d3.select(element).append("svg:svg")
			.attr("width", _options.size.canvasWidth)
			.attr("height", _options.size.canvasHeight);
	};

	/**
	 * Adds the Pie Chart title.
	 * @param titleData
	 * @private
	 */
	var _addTitle = function(titleData) {
		var title = _svg.selectAll(".title")
			.data([titleData]);

		title.enter()
			.append("text")
			.attr("class", "title")
			.attr("x", 20)
			.attr("y", 20)
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font", function(d) { return d.font; })
	};

	var _getTotalPieSize = function(data) {
		var totalSize = 0;
		for (var i=0; i<data.length; i++) {
			totalSize += data[i].value;
		}
		return totalSize;
	};

	var _openSegment = function(segment) {

		// close any open segments
		if ($(".expanded").length > 0) {
			_closeSegment($(".expanded")[0]);
		}

		d3.select(segment).transition()
			.duration(400)
			.attr("transform", function(d, i) {
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y),
					pullOutSize = 8;

				return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
			})
			.each("end", function(d, i) {
				$(this).attr("class", "expanded");
			});
	};

	var _closeSegment = function(segment) {
		d3.select(segment).transition()
			.duration(400)
			.attr("transform", "translate(0,0)")
			.each("end", function(d, i) {
				$(this).attr("class", "");
			});
	};

	var _arcTween = function(b) {
		var i = d3.interpolate({ value: 0 }, b);
		return function(t) {
			return _arc(i(t));
		};
	};

	var _getSegmentRotationAngle = function(index, data, totalSize) {
		var val = 0;
		for (var i=0; i<index; i++) {
			val += data[i].value;
		}
		return (val / totalSize) * 360;
	};

	/**
	 * Creates the pie chart segments and displays them according to the selected load effect.
	 * @param element
	 * @param options
	 * @private
	 */
	var _createPie = function() {
		var pieChartElement = _svg.append("g")
			.attr("transform", _getSVGCenter)
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
				_data.filter(function(d) { return d.value; }),
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
		if (_options.effects.loadEffect !== "default") {
			_options.effects.loadEffectSpeed = 0;
		}

		g.append("path")
			.attr("id", function(d, i) { return "segment" + i; })
			.style("fill", function(d, index) { return _options.styles.colors[index]; })
			.style("stroke", "#ffffff")
			.style("stroke-width", 1)
			.transition()
			.ease("cubic-in-out")
			.duration(_options.effects.loadEffectSpeed)
			.attrTween("d", _arcTween);

		_svg.selectAll("g.arc")
			.attr("transform",
				function(d, i) {
					var angle = _getSegmentRotationAngle(i, _data, _totalSize);
					return "rotate(" + angle + ")";
				}
			);
	};


	/**
	 * Add the labels to the pie.
	 * @param options
	 * @private
	 */
	var _addLabels = function() {

		// 1. Add the main label (not positioned yet)
		var labelGroup = _svg.selectAll(".labelGroup")
			.data(
				_data.filter(function(d) { return d.value; }),
				function(d) { return d.label; }
			)
			.enter()
			.append("g")
			.attr("class", "labelGroup")
			.attr("id", function(d, i) {
				return "labelGroup" + i;
			})
			.attr("transform", _getSVGCenter);

		labelGroup.append("text")
			.attr("class", "segmentLabel")
			.attr("id", function(d, i) { return "label" + i; })
			.text(function(d) { return d.label; })
			.style("font-size", "8pt")
			.style("fill", _options.labels.labelColor)
			.style("opacity", 0);

		// 2. Add the percentage label (not positioned yet)


		// 3. Add the value label (not positioned yet)

		/*
		labelGroup.append("text")
			.text(function(d) {
				return Math.round((d.value / _totalSize) * 100) + "%";
			})
			.attr("class", "pieShare")
			.attr("transform", function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, _data, _totalSize);
				var labelRadius = _outerRadius + 30;
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.style("fill", options.labels.labelPercentageColor)
			.style("font-size", "8pt")
			.style("opacity", function() {
				return (options.effects.loadEffect === "fadein") ? 0 : 1;
			});
		*/

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.loadEffect === "default") ? _options.effects.loadEffectSpeed : 1;

		setTimeout(function() {
			var labelFadeInTime = (_options.effects.loadEffect === "default") ? _options.effects.labelFadeInTime : 1;
			d3.selectAll("text.segmentLabel")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);
		}, loadSpeed);


		// now place the labels in reasonable locations. This needs to run in a timeout because we need the actual
		// text elements in place prior to
		setTimeout(_addLabelLines, 1);
	};


	var _addLabelLines = function() {
		var pieDistance = 16; // TODO: make configurable
		var lineMidPointDistance = pieDistance - (pieDistance / 4);
		var circleCoordGroups = [];

		d3.selectAll(".segmentLabel")
			.style("opacity", 0)
			.attr("dx", function(d, i) {
				var labelDimensions = document.getElementById("label" + i).getBBox();

				var angle = _getSegmentRotationAngle(i, _data, _totalSize);
				var nextAngle = 360;
				if (i < _options.data.length - 1) {
					nextAngle = _getSegmentRotationAngle(i+1, _data, _totalSize);
				}

				var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
				var remainderAngle = segmentCenterAngle % 90;
				var quarter = Math.floor(segmentCenterAngle / 90);

				var labelXMargin = 10; // the x-distance of the label from the end of the line [TODO configurable?]

				var p1, p2, p3, labelX;
				switch (quarter) {
					case 0:
						var calc1 = Math.sin(_toRadians(remainderAngle));
						labelX = calc1 * (_outerRadius + pieDistance) + labelXMargin;
						p1     = calc1 * _outerRadius;
						p2     = calc1 * (_outerRadius + lineMidPointDistance);
						p3     = calc1 * (_outerRadius + pieDistance) + 5;
						break;
					case 1:
						var calc2 = Math.cos(_toRadians(remainderAngle));
						labelX = calc2 * (_outerRadius + pieDistance) + labelXMargin;
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance);
						p3     = calc2 * (_outerRadius + pieDistance) + 5;
						break;
					case 2:
						var calc3 = Math.sin(_toRadians(remainderAngle));
						labelX = -calc3 * (_outerRadius + pieDistance) - labelDimensions.width - labelXMargin;
						p1     = -calc3 * _outerRadius;
						p2     = -calc3 * (_outerRadius + lineMidPointDistance);
						p3     = -calc3 * (_outerRadius + pieDistance) - 5;
						break;
					case 3:
						var calc4 = Math.cos(_toRadians(remainderAngle));
						labelX = -calc4 * (_outerRadius + pieDistance) - labelDimensions.width - labelXMargin;
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance);
						p3     = -calc4 * (_outerRadius + pieDistance) - 5;
						break;
				}
				circleCoordGroups[i] = [
					{ x: p1, y: null },
					{ x: p2, y: null },
					{ x: p3, y: null }
				];

				return labelX;
			})
			.attr("dy", function(d, i) {
				var labelDimensions = document.getElementById("label" + i).getBBox();
				var heightOffset = labelDimensions.height / 5;

				var angle = _getSegmentRotationAngle(i, _data, _totalSize);
				var nextAngle = 360;
				if (i < _options.data.length - 1) {
					nextAngle = _getSegmentRotationAngle(i+1, _data, _totalSize);
				}
				var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
				var remainderAngle = (segmentCenterAngle % 90);
				var quarter = Math.floor(segmentCenterAngle / 90);
				var p1, p2, p3, labelY;

				switch (quarter) {
					case 0:
						var calc1 = Math.cos(_toRadians(remainderAngle));
						labelY = -calc1 * (_outerRadius + pieDistance);
						p1     = -calc1 * _outerRadius;
						p2     = -calc1 * (_outerRadius + lineMidPointDistance);
						p3     = -calc1 * (_outerRadius + pieDistance) - heightOffset;
						break;
					case 1:
						var calc2 = Math.sin(_toRadians(remainderAngle));
						labelY = calc2 * (_outerRadius + pieDistance);
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance);
						p3     = calc2 * (_outerRadius + pieDistance) - heightOffset;
						break;
					case 2:
						var calc3 = Math.cos(_toRadians(remainderAngle));
						labelY = calc3 * (_outerRadius + pieDistance);
						p1     = calc3 * _outerRadius;
						p2     = calc3 * (_outerRadius + lineMidPointDistance);
						p3     = calc3 * (_outerRadius + pieDistance) - heightOffset;
						break;
					case 3:
						var calc4 = Math.sin(_toRadians(remainderAngle));
						labelY = -calc4 * (_outerRadius + pieDistance);
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance);
						p3     = -calc4 * (_outerRadius + pieDistance) - heightOffset;
						break;
				}
				circleCoordGroups[i][0].y = p1;
				circleCoordGroups[i][1].y = p2;
				circleCoordGroups[i][2].y = p3;

				return labelY;
			});

		// add the main line groups
		var lineGroups = _svg.insert("g", ".pieChart");

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(circleCoordGroups)
			.enter()
			.append("g")
			.attr("class", "lineGroup")
			.attr("transform", _getSVGCenter);

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", "#666666")
			.attr("stroke-width", 1)
			.attr("fill", "none");
	};

	var _addSegmentEventHandlers = function() {
		if (!_options.effects.pullOutSegmentOnClick) {
			return;
		}

		$(".arc").on("click", function(e) {
			var $segment = $(e.currentTarget).find("path");

			// TODO detect if it's currently moving here

			if ($segment.attr("class") === "expanded") {
				_closeSegment($segment[0]);
			} else {
				_openSegment($segment[0]);
			}
		});
	};

	var _toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var _toDegrees = function(radians) {
		return radians * (180 / Math.PI);
	};

	var _getSVGCenter = function() {
		return "translate(" + (_options.size.canvasWidth/2) + "," + (_options.size.canvasHeight/2) + ")"
	}

})(jQuery, window, document);