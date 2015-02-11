// --------- segments.js -----------
var segments = {

	/**
	 * Creates the pie chart segments and displays them according to the desired load effect.
	 * @private
	 */
	create: function(pie) {
		var pieCenter = pie.pieCenter;
		var colors = pie.options.colors;
		var loadEffects = pie.options.effects.load;
		var segmentStroke = pie.options.misc.colors.segmentStroke;

		// we insert the pie chart BEFORE the title, to ensure the title overlaps the pie
		var pieChartElement = pie.svg.insert("g", "#" + pie.cssPrefix + "title")
			.attr("transform", function() { return math.getPieTranslateCenter(pieCenter); })
			.attr("class", pie.cssPrefix + "pieChart");

		var arc = d3.svg.arc()
			.innerRadius(pie.innerRadius)
			.outerRadius(pie.outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				return (d.value / pie.totalSize) * 2 * Math.PI;
			});

		var g = pieChartElement.selectAll("." + pie.cssPrefix + "arc")
			.data(pie.options.data.content)
			.enter()
			.append("g")
			.attr("class", pie.cssPrefix + "arc");

		// if we're not fading in the pie, just set the load speed to 0
		var loadSpeed = loadEffects.speed;
		if (loadEffects.effect === "none") {
			loadSpeed = 0;
		}

		g.append("path")
			.attr("id", function(d, i) { return pie.cssPrefix + "segment" + i; })
			.attr("fill", function(d, i) {
				var color = colors[i];
				if (pie.options.misc.gradient.enabled) {
					color = "url(#" + pie.cssPrefix + "grad" + i + ")";
				}
				return color;
			})
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

		pie.svg.selectAll("g." + pie.cssPrefix + "arc")
			.attr("transform",
			function(d, i) {
				var angle = 0;
				if (i > 0) {
					angle = segments.getSegmentAngle(i-1, pie.options.data.content, pie.totalSize);
				}
				return "rotate(" + angle + ")";
			}
		);
		pie.arc = arc;
	},

	addGradients: function(pie) {
		var grads = pie.svg.append("defs")
			.selectAll("radialGradient")
			.data(pie.options.data.content)
			.enter().append("radialGradient")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", "120%")
			.attr("id", function(d, i) { return pie.cssPrefix + "grad" + i; });

		grads.append("stop").attr("offset", "0%").style("stop-color", function(d, i) { return pie.options.colors[i]; });
		grads.append("stop").attr("offset", pie.options.misc.gradient.percentage + "%").style("stop-color", pie.options.misc.gradient.color);
	},

	addSegmentEventHandlers: function(pie) {
		var arc = d3.selectAll("." + pie.cssPrefix + "arc,." + pie.cssPrefix + "labelGroup-inner,." + pie.cssPrefix + "labelGroup-outer");

		arc.on("click", function() {
			var currentEl = d3.select(this);
			var segment;

			// mouseover works on both the segments AND the segment labels, hence the following
			if (currentEl.attr("class") === pie.cssPrefix + "arc") {
				segment = currentEl.select("path");
			} else {
				var index = currentEl.attr("data-index");
				segment = d3.select("#" + pie.cssPrefix + "segment" + index);
			}
			var isExpanded = segment.attr("class") === pie.cssPrefix + "expanded";
			segments.onSegmentEvent(pie, pie.options.callbacks.onClickSegment, segment, isExpanded);
			if (pie.options.effects.pullOutSegmentOnClick.effect !== "none") {
				if (isExpanded) {
					segments.closeSegment(pie, segment.node());
				} else {
					segments.openSegment(pie, segment.node());
				}
			}
		});

		arc.on("mouseover", function() {
			var currentEl = d3.select(this);
			var segment, index;

			if (currentEl.attr("class") === pie.cssPrefix + "arc") {
				segment = currentEl.select("path");
			} else {
				index = currentEl.attr("data-index");
				segment = d3.select("#" + pie.cssPrefix + "segment" + index);
			}

			if (pie.options.effects.highlightSegmentOnMouseover) {
				index = segment.attr("data-index");
				var segColor = pie.options.colors[index];
				segment.style("fill", helpers.getColorShade(segColor, pie.options.effects.highlightLuminosity));
			}

      if (pie.options.tooltips.enabled) {
        index = segment.attr("data-index");
        tt.showTooltip(pie, index);
      }

			var isExpanded = segment.attr("class") === pie.cssPrefix + "expanded";
			segments.onSegmentEvent(pie, pie.options.callbacks.onMouseoverSegment, segment, isExpanded);
		});

    arc.on("mousemove", function() {
      tt.moveTooltip(pie);
    });

		arc.on("mouseout", function() {
			var currentEl = d3.select(this);
			var segment, index;

			if (currentEl.attr("class") === pie.cssPrefix + "arc") {
				segment = currentEl.select("path");
			} else {
				index = currentEl.attr("data-index");
				segment = d3.select("#" + pie.cssPrefix + "segment" + index);
			}

			if (pie.options.effects.highlightSegmentOnMouseover) {
				index = segment.attr("data-index");
				var color = pie.options.colors[index];
				if (pie.options.misc.gradient.enabled) {
					color = "url(#" + pie.cssPrefix + "grad" + index + ")";
				}
				segment.style("fill", color);
			}

      if (pie.options.tooltips.enabled) {
        index = segment.attr("data-index");
        tt.hideTooltip(pie, index);
      }

			var isExpanded = segment.attr("class") === pie.cssPrefix + "expanded";
			segments.onSegmentEvent(pie, pie.options.callbacks.onMouseoutSegment, segment, isExpanded);
		});
	},

	// helper function used to call the click, mouseover, mouseout segment callback functions
	onSegmentEvent: function(pie, func, segment, isExpanded) {
		if (!helpers.isFunction(func)) {
			return;
		}
		var index = parseInt(segment.attr("data-index"), 10);
		func({
			segment: segment.node(),
			index: index,
			expanded: isExpanded,
			data: pie.options.data.content[index]
		});
	},

	openSegment: function(pie, segment) {
		if (pie.isOpeningSegment) {
			return;
		}
		pie.isOpeningSegment = true;

		// close any open segments
		if (d3.selectAll("." + pie.cssPrefix + "expanded").length > 0) {
			segments.closeSegment(pie, d3.select("." + pie.cssPrefix + "expanded").node());
		}

		d3.select(segment).transition()
			.ease(pie.options.effects.pullOutSegmentOnClick.effect)
			.duration(pie.options.effects.pullOutSegmentOnClick.speed)
			.attr("transform", function(d, i) {
				var c = pie.arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y),
					pullOutSize = parseInt(pie.options.effects.pullOutSegmentOnClick.size, 10);

				return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
			})
			.each("end", function(d, i) {
				pie.currentlyOpenSegment = segment;
				pie.isOpeningSegment = false;
				d3.select(this).attr("class", pie.cssPrefix + "expanded");
			});
	},

	closeSegment: function(pie, segment) {
		d3.select(segment).transition()
			.duration(400)
			.attr("transform", "translate(0,0)")
			.each("end", function(d, i) {
				d3.select(this).attr("class", "");
				pie.currentlyOpenSegment = null;
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
		var options = extend({
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
		var angle = (fullValue / totalSize) * 360;

		// lastly, if we want the midpoint, factor that sucker in
		if (options.midpoint) {
			var currAngle = (currValue / totalSize) * 360;
			angle -= (currAngle / 2);
		}

		return angle;
	},

	getPercentage: function(pie, index, decimalPlaces) {
		var relativeAmount = pie.options.data.content[index].value / pie.totalSize;
		if (decimalPlaces <= 0) {
			return Math.round(relativeAmount * 100);
		} else {
			return (relativeAmount * 100).toFixed(decimalPlaces);
		}
	}

};
