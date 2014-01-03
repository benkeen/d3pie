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

	var _pluginName = "d3pie";
	var _defaultSettings = {
		title: {
			text: "Programming languages",
			color: "#000000",
			fontSize: "",
			font: ""
		},
		colors: {
			background: null,
			segments: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"]
		},
		width: 500,
		height: 500,
		effects: {
			load: "",
			loadSpeed: 1000,
			highlightSegmentOnMouseover: true,
			pullOutSegmentOnClick: true,
			labelFadeInTime: 400
		}
	};


	// our constructor
	function d3pie(element, options) {
		this.element = element;

		console.log(options);

		this.options = $.extend({}, _defaultSettings, options);

		// TODO confirm the required parameters have been set

		// TODO confirm d3 is available

		this._defaults = _defaultSettings;
		this._name = _pluginName;

		// now initialize the thing
		this.init();
	}

	// prevents multiple instantiations of the same plugin
	$.fn[_pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + _pluginName)) {
				$.data(this, 'plugin_' + _pluginName, new d3pie(this, options));
			}
		});
	};


	var _arc, _svg, _totalSize, _data;
	d3pie.prototype.init = function() {

		// store the options in a local var for circumventing any "this" nonsense
		var options = this.options;
		_data      = this.options.data;
		_totalSize = _getTotalPieSize(_data);

		// temporary
		options.outerRadius = ((options.width < options.height) ? options.width : options.height) / 3;

		_addSVGSpace(this.element, options);
		_addTitle(options.title);
		_createPie(this.element, options);
		_addLabels(options);
		_addSegmentEventHandlers();
	};


	// ----- public functions -----

	// TODO destroy



	// ----- private functions -----

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

	var _getSegmentRotationAngle = function(d, index, data, totalSize) {
		var val = 0;
		for (var i=0; i<index; i++) {
			val += data[i].value;
		}
		return (val / totalSize) * 360;
	};

	var _addSVGSpace = function(element, options) {
		_svg = d3.select(element).append("svg:svg")
			.attr("width", options.width)
			.attr("height", options.height);
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


	var _createPie = function(element, options) {
		var pieChartElement = _svg.append("g")
			.attr("transform", "translate(" + (options.width/2) + "," + (options.height/2) + ")")
			.attr("class", "pieChart");

		_arc = d3.svg.arc()
			.innerRadius(options.innerRadius)
			.outerRadius(options.outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				return (d.value / _totalSize) * 2 * Math.PI;
			});

		var g = pieChartElement.selectAll(".arc")
			.data(
				_data.filter(function(d) { return d.value; }),
				function(d) { return d.label; }
			)
			.enter()
			.append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("id", function(d, i) {
				return "segment" + i;
			})
			.style("fill", function(d, index) {
				return options.colors.segments[index];
			})
			.transition()
			.ease("cubic-in-out")
			.duration(options.effects.loadSpeed)
			.attrTween("d", _arcTween);

		_svg.selectAll("g.arc")
			.attr("transform",
				function(d, i) {
					var angle = _getSegmentRotationAngle(d, i, _data, _totalSize);
					return "rotate(" + angle + ")";
				}
			);
	};

	var _addLabels = function(options) {
		var labelGroup = _svg.selectAll(".arc")
			.append("g")
			.attr("class", "labelGroup")
			.attr("id", function(d, i) {
				return "labelGroup" + i;
			});

		labelGroup.append("text")
			.attr("class", "segmentLabel")
			.attr("id", function(d, i) {
				return "label" + i;
			})
			.text(function(d) {
				return d.label;
			})
			.attr("transform", function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, _data, _totalSize);
				var labelRadius = options.outerRadius + 20;
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.style('opacity', 0)
			.style('font-size', "8pt");

		labelGroup.append("text")
			.text(function(d) {
				return Math.round((d.value / _totalSize) * 100) + "%";
			})
			.attr("class", "pieShare")
			.attr("transform", function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, _data, _totalSize);
				var labelRadius = options.outerRadius + 20;
				var c = _arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.attr("dx", function(d, i) {
				var correspondingLabelWidth = document.getElementById("label" + i).getComputedTextLength();
				return correspondingLabelWidth + 3;
			})
			.style("opacity", 0);

		// fade in the labels when the load effect is complete
		setTimeout(function() {
			d3.selectAll("text.segmentLabel")
				.transition()
				.duration(options.effects.labelFadeInTime)
				.style("opacity", 1);
		}, options.effects.loadSpeed);
	};

	var _addSegmentEventHandlers = function() {
		$(".arc").on("click", function(e) {
			var $segment = $(e.currentTarget).find("path");

			// detect if it's currently moving here
			if ($segment.attr("class") === "expanded") {
				_closeSegment($segment[0]);
			} else {
				_openSegment($segment[0]);
			}
		});
	};

})(jQuery, window, document);

