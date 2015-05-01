// --------- validate.js -----------
var tt = {
	addTooltips: function(pie) {

		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var tooltips = pie.svg.insert("g")
			.attr("class", pie.cssPrefix + "tooltips");

    tooltips.selectAll("." + pie.cssPrefix + "tooltip")
      .data(pie.options.data.content)
      .enter()
      .append("g")
        .attr("class", pie.cssPrefix + "tooltip")
        .attr("id", function(d, i) { return pie.cssPrefix + "tooltip" + i; })
        .style("opacity", 0)
      .append("rect")
        .attr({
			    rx: pie.options.tooltips.styles.borderRadius,
			    ry: pie.options.tooltips.styles.borderRadius,
			    x: -pie.options.tooltips.styles.padding,
			    opacity: pie.options.tooltips.styles.backgroundOpacity
		    })
		    .style("fill", pie.options.tooltips.styles.backgroundColor);

    tooltips.selectAll("." + pie.cssPrefix + "tooltip")
      .data(pie.options.data.content)
      .append("text")
        .attr("fill", function(d) { return pie.options.tooltips.styles.color; })
        .style("font-size", function(d) { return pie.options.tooltips.styles.fontSize; })
        .style("font-family", function(d) { return pie.options.tooltips.styles.font; })
        .text(function(d, i) {
          var caption = pie.options.tooltips.string;
          if (pie.options.tooltips.type === "caption") {
            caption = d.caption;
          }
          return tt.replacePlaceholders(pie, caption, i, {
            label: d.label,
            value: d.value,
            percentage: segments.getPercentage(pie, i, pie.options.labels.percentage.decimalPlaces)
          });
        });

		tooltips.selectAll("." + pie.cssPrefix + "tooltip rect")
			.attr({
				width: function (d, i) {
					var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
					return dims.w + (2 * pie.options.tooltips.styles.padding);
				},
				height: function (d, i) {
					var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
					return dims.h + (2 * pie.options.tooltips.styles.padding);
				},
				y: function (d, i) {
					var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
					return -(dims.h / 2) + 1;
				}
			});
	},

  showTooltip: function(pie, index) {

	  var fadeInSpeed = pie.options.tooltips.styles.fadeInSpeed;
	  if (tt.currentTooltip === index) {
		  fadeInSpeed = 1;
	  }

    tt.currentTooltip = index;
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .transition()
      .duration(fadeInSpeed)
      .style("opacity", function() { return 1; });

    tt.moveTooltip(pie);
  },

  moveTooltip: function(pie) {
    d3.selectAll("#" + pie.cssPrefix + "tooltip" + tt.currentTooltip)
      .attr("transform", function(d) {
        var mouseCoords = d3.mouse(this.parentNode);
        var x = mouseCoords[0] + pie.options.tooltips.styles.padding + 2;
        var y = mouseCoords[1] - (2 * pie.options.tooltips.styles.padding) - 2;
        return "translate(" + x + "," + y + ")";
      });
  },

  hideTooltip: function(pie, index) {
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .style("opacity", function() { return 0; });

    // move the tooltip offscreen. This ensures that when the user next mouseovers the segment the hidden
    // element won't interfere
    d3.select("#" + pie.cssPrefix + "tooltip" + tt.currentTooltip)
       .attr("transform", function(d, i) {

         // klutzy, but it accounts for tooltip padding which could push it onscreen
         var x = pie.options.size.canvasWidth + 1000;
         var y = pie.options.size.canvasHeight + 1000;
         return "translate(" + x + "," + y + ")";
       });
  },

  replacePlaceholders: function(pie, str, index, replacements) {

    // if the user has defined a placeholderParser function, call it before doing the replacements
    if (helpers.isFunction(pie.options.tooltips.placeholderParser)) {
      pie.options.tooltips.placeholderParser(index, replacements);
    }

    var replacer = function()  {
      return function(match) {
        var placeholder = arguments[1];
        if (replacements.hasOwnProperty(placeholder)) {
          return replacements[arguments[1]];
        } else {
          return arguments[0];
        }
      };
    };
    return str.replace(/\{(\w+)\}/g, replacer(replacements));
  }
};
