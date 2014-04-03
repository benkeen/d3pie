// --------- segments.js -----------
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
			.attrTween("d", function(b) {
				var i = d3.interpolate({ value: 0 }, b);
				return function(t) {
					return pie.arc(i(t));
				};
			});

		svg.selectAll("g." + cssPrefix + "arc")
			.attr("transform",
			function(d, i) {
				var angle = 0;
				if (i > 0) {
					angle = segments.getSegmentAngle(i-1, pie.options.data, pie.totalSize);
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