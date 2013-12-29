/*!
 * d3pie jQuery plugin
 * @author Ben Keen
 * @version 0.1.0
 * @date Dec 2013
 * http://github.com/benkeen/d3pie
 */
;(function($, window, document) {

	var _pluginName = "d3pie";
	var _defaultSettings = {

		// required
		data: [],
		w: 500,
		h: 400,

		// optional
		title: "",
		slideInSpeed: 900,
		labelFadeInTime: 500,
		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"],
		innerRadius: 0,
		outerRadius: 150, // TODO this should be calculated now
		percentOrValue: "percent"
	};


	// our constructor
	function d3pie(element, options) {
		this.element = element;
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

	// TODO obviously refactor
	d3pie.prototype.init = function() {

		// store the options in a local var for circumventing any "this" nonsense
		var options = this.options;
		var data    = this.options.data;
		var totalSize = _getTotalPieSize(data);

		var arc = d3.svg.arc()
			.innerRadius(options.innerRadius)
			.outerRadius(options.outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				return (d.value / totalSize) * 2 * Math.PI;
			});

		var svg = d3.select(this.element[0]).append("svg:svg")
			.attr("width", options.w)
			.attr("height", options.h)
			.append("svg:g")
			.attr("transform", "translate(" + (options.w/2) + "," + (options.h/2) + ")");

		var g = svg.selectAll(".arc")
			.data(
				data.filter(function(d) { return d.value; }),
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
				return options.colors[index];
			})
			.transition()
			.ease("cubic-in-out")
			.duration(options.slideInSpeed)
			.attrTween("d", _arcTween);

		svg.selectAll("g")
			.attr("transform",
			function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, data, totalSize);
				return "rotate(" + angle + ")";
			}
		);

		var labelGroup = svg.selectAll(".arc")
			.append("g")
			.attr("class", "labelGroup")
			.attr("id", function(d, i) {
				return "labelGroup" + i
			});

		labelGroup.append("text")
			.attr("id", function(d, i) {
				return "label" + i
			})
			.text(function(d) {
				return d.label;
			})
			.attr("transform", function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, data, totalSize);
				var labelRadius = options.outerRadius + 20;
				var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.style('opacity', 0)
			.style('font-weight', "bold");

		labelGroup.append("text")
			.text(function(d) {
				return Math.round((d.value / totalSize) * 100) + "%";
			})
			.attr("class", "pieShare")
			.attr("transform", function(d, i) {
				var angle = _getSegmentRotationAngle(d, i, data, totalSize);
				var labelRadius = options.outerRadius + 20;
				var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.attr("dx", function(d, i) {
				var correspondingLabelWidth = document.getElementById("label" + i).getComputedTextLength();
				return correspondingLabelWidth + 3;
			})
			.style('opacity', 0);

		labelGroup
			.attr("dx", function(d, i) {
				return "-200px";
			});

		// fade in the labels when the load effect is complete
		setTimeout(function() {
			g.selectAll("text")
				.transition()
				.duration(options.labelFadeInTime)
				.style('opacity', 1);
		}, options.slideInSpeed);

		$(function() {
			$(".arc").on("click", function(e) {
				var $segment = $(e.currentTarget).find("path");

				// detect if it's currently moving here

				if ($segment.attr("class") === "expanded") {
					_closeSegment($segment[0]);
				} else {
					_openSegment($segment[0]);
				}
			});
		});
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
			closeSegment($(".expanded")[0]);
		}

		d3.select(segment).transition()
			.duration(400)
			.attr("transform", function(d, i) {
				var c = arc.centroid(d),
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
			return arc(i(t));
		};
	}

	var _getSegmentRotationAngle = function(d, index, data, totalSize) {
		var val = 0;
		for (var i=0; i<index; i++) {
			val += data[i].value;
		}
		return (val / totalSize) * 360;
	}

})(jQuery, window, document);

