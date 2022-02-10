// --------- text.js -----------
var text = {
	offscreenCoord: -10000,

	addTitle: function(pie) {


		var title = pie.svg.selectAll("." + pie.cssPrefix + "title")
			.data([pie.options.header.title])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("id", pie.cssPrefix + "title")
        	.attr("class", pie.cssPrefix + "title")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("text-anchor", function() {
				var location;
				if (pie.options.header.location === "top-center" || pie.options.header.location === "pie-center") {
					location = "middle";
				} else {
					location = "left";
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.style("font-size", function(d) { return d.fontSize + "px"; })
			.style("font-family", function(d) { return d.font; });
	},

	positionTitle: function(pie) {
		var textComponents = pie.textComponents;
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;

		var x;
		if (headerLocation === "top-left") {
			x = canvasPadding.left;
		} else {
			x = ((canvasWidth - canvasPadding.right) / 2) + canvasPadding.left;
		}

    // add whatever offset has been added by user
    x += pie.options.misc.pieCenterOffset.x;

		var y = canvasPadding.top + textComponents.title.h;

		if (headerLocation === "pie-center") {
			y = pie.pieCenter.y;

			// still not fully correct
			if (textComponents.subtitle.exists) {
				var totalTitleHeight = textComponents.title.h + titleSubtitlePadding + textComponents.subtitle.h;
				y = y - (totalTitleHeight / 2) + textComponents.title.h;
			} else {
				y += (textComponents.title.h / 4);
			}
		}

		pie.svg.select("#" + pie.cssPrefix + "title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function(pie) {
		var headerLocation = pie.options.header.location;

		pie.svg.selectAll("." + pie.cssPrefix + "subtitle")
			.data([pie.options.header.subtitle])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", pie.cssPrefix + "subtitle")
			.attr("class", pie.cssPrefix + "subtitle")
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
			.style("font-size", function(d) { return d.fontSize + "px"; })
			.style("font-family", function(d) { return d.font; });
	},

	positionSubtitle: function(pie) {
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;

		var x;
		if (pie.options.header.location === "top-left") {
			x = canvasPadding.left;
		} else {
			x = ((canvasWidth - canvasPadding.right) / 2) + canvasPadding.left;
		}

    // add whatever offset has been added by user
    x += pie.options.misc.pieCenterOffset.x;

		var y = text.getHeaderHeight(pie);
		pie.svg.select("#" + pie.cssPrefix + "subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function(pie) {
		pie.svg.selectAll("." + pie.cssPrefix + "footer")
			.data([pie.options.footer])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", pie.cssPrefix + "footer")
			.attr("class", pie.cssPrefix + "footer")
			.attr("text-anchor", function() {
				var location = "left";
				if (pie.options.footer.location === "bottom-center") {
					location = "middle";
				} else if (pie.options.footer.location === "bottom-right") {
					location = "left"; // on purpose. We have to change the x-coord to make it properly right-aligned
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.style("font-size", function(d) { return d.fontSize + "px"; })
			.style("font-family", function(d) { return d.font; });
	},

	positionFooter: function(pie) {
		var footerLocation = pie.options.footer.location;
		var footerWidth = pie.textComponents.footer.w;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var canvasPadding = pie.options.misc.canvasPadding;

		var x;
		if (footerLocation === "bottom-left") {
			x = canvasPadding.left;
		} else if (footerLocation === "bottom-right") {
			x = canvasWidth - footerWidth - canvasPadding.right;
		} else {
			x = canvasWidth / 2; // TODO - shouldn't this also take into account padding?
		}

		pie.svg.select("#" + pie.cssPrefix + "footer")
			.attr("x", x)
			.attr("y", canvasHeight - canvasPadding.bottom);
	},

	getHeaderHeight: function(pie) {
		var h;
		if (pie.textComponents.title.exists) {

			// if the subtitle isn't defined, it'll be set to 0
			var totalTitleHeight = pie.textComponents.title.h + pie.options.header.titleSubtitlePadding + pie.textComponents.subtitle.h;
			if (pie.options.header.location === "pie-center") {
				h = pie.pieCenter.y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				h = totalTitleHeight + pie.options.misc.canvasPadding.top;
			}
		} else {
			if (pie.options.header.location === "pie-center") {
				var footerPlusPadding = pie.options.misc.canvasPadding.bottom + pie.textComponents.footer.h;
				h = ((pie.options.size.canvasHeight - footerPlusPadding) / 2) + pie.options.misc.canvasPadding.top + (pie.textComponents.subtitle.h / 2);
			} else {
				h = pie.options.misc.canvasPadding.top + pie.textComponents.subtitle.h;
			}
		}
		return h;
	},

	addLegend: function(pie) {
		var legendTexts = pie.svg.selectAll("." + pie.cssPrefix + "legend")
			.data(pie.options.data.content)
			.enter()
			.append("text")
			.text(function(d) { return d.label; })
			.attr("x", function() {
				var x = pie.options.legend.shapeSize + 1,
					location = pie.options.legend.location.split("-")[1];
				if ( location === "right") {
					x = pie.options.size.canvasWidth - pie.options.legend.shapeSize - 1;
				} else if (location === "center") {
					x = pie.options.size.canvasWidth / 2; 
				}
				return x;
			})
			.attr("y", function(d, i) { 
				var location = pie.options.legend.location.split('-')[0],
					base = 0,
					lineHeight = pie.options.legend.fontSize;
				if(location === 'bottom') {
					base = pie.options.size.canvasHeight - (pie.options.data.content.length * lineHeight);
				}
				return base + (i + 1) * lineHeight;
			 })
			.attr("id", pie.cssPrefix + "legend")
			.attr("class", pie.cssPrefix + "legend")
			.attr("text-anchor", function() {
				var anchor = "start",
					location = pie.options.legend.location.split("-")[1];
				if (location === "right") {
					anchor = "end";
				} else if (location === "center") {
					anchor = "middle"; 
				}
				return anchor;
			})
			.style('fill', function(d, i){ return pie.options.colors[i];})
			.style("font-size", function(d) { return pie.options.legend.fontSize + "px"; })
			.style("font-family", function(d) { return pie.options.legend.font; });
		
		if(pie.options.legend.shape) {
			var textsArray = [];
			legendTexts.each(function(data, i, texts){
				textsArray = texts;
			});
			var shapes = pie.svg.selectAll("." + pie.cssPrefix + "legend-shape")
				.data(textsArray)
				.enter()
				.append(pie.options.legend.shape)
				.attr("class", pie.cssPrefix + "legend-shape")
				.style("fill", function(d, i){ return pie.options.colors[i];});

			if(pie.options.legend.shape === 'circle') {
				var radius = pie.options.legend.shapeSize / 2;
				shapes.attr('cx', function(d) {
					var x = radius,
						location = pie.options.legend.location.split("-")[1];
					if ( location === "right") {
						x = pie.options.size.canvasWidth - radius;
					} else if (location === "center") {
						x = d.getStartPositionOfChar(0).x - radius - 1;
					}
					return x;
				})
				.attr('cy', function(d, i) { 
					var location = pie.options.legend.location.split('-')[0],
						base = -radius,
						lineHeight = pie.options.legend.fontSize;
					if(location === 'bottom') {
						base = pie.options.size.canvasHeight - (pie.options.data.content.length * lineHeight) - radius;
					}
					return base + (i + 1) * lineHeight;
				})
				.attr("r", radius);
			}
			else {
				var shapeWidth = pie.options.legend.shapeSize;
				shapes.attr('x', function(d) {
					var x = 0,
						location = pie.options.legend.location.split("-")[1];
					if ( location === "right") {
						x = pie.options.size.canvasWidth - shapeWidth;
					} else if (location === "center") {
						x = d.getStartPositionOfChar(0).x - shapeWidth - 1;
					}
					return x;
				})
				.attr('y', function(d, i) { 
					var location = pie.options.legend.location.split('-')[0],
						base = -shapeWidth,
						lineHeight = pie.options.legend.fontSize;
					if(location === 'bottom') {
						base = pie.options.size.canvasHeight - (pie.options.data.content.length * lineHeight) - shapeWidth;
					}
					return base + (i + 1) * lineHeight;
				})
				.attr("text-anchor", function() {
					var anchor = "start",
						location = pie.options.legend.location.split("-")[1];
					if (location === "right") {
						anchor = "end";
					} else if (location === "center") {
						anchor = "middle"; 
					}
					return anchor;
				})
				.attr("width", shapeWidth)
				.attr("height", shapeWidth);
			}
		}
	}
};
