// --------- text.js -----------

/**
 * Contains the code for the main text elements: title, subtitle + footer.
 */
var text = {

	components: {
		title: {
			exists: false,
			h: 0,
			w: 0
		},
		subtitle: {
			exists: false,
			h: 0,
			w: 0
		},
		footer: {
			exists: false,
			h: 0,
			w: 0
		}
	},

	offscreenCoord: -10000,

	// these are used all over the place
	trackComponents: function() {
		text.components.title.exists    = _options.header.title.text !== "";
		text.components.subtitle.exists = _options.header.subtitle.text !== "";
		text.components.footer.exists   = _options.footer.text !== "";
	},

	storeComponentDimensions: function() {
		if (text.components.title.exists) {
			var d1 = helpers.getDimensions("title");
			text.components.title.h = d1.h;
			text.components.title.w = d1.w;
		}
		if (text.components.subtitle.exists) {
			var d2 = helpers.getDimensions("subtitle");
			text.components.subtitle.h = d2.h;
			text.components.subtitle.w = d2.w;
		}
	},

	addTextElementsOffscreen: function() {
		if (text.components.title.exists) {
			text.addTitle();
		}
		if (text.components.subtitle.exists) {
			text.addSubtitle();
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
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
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
		var y = _options.misc.canvasPadding.top + text.components.title.h;

		if (_options.header.location === "pie-center") {
			var pieCenter = math.getPieCenter();
			y = pieCenter.y;

			// still not fully correct.
			if (text.components.subtitle.exists) {
				var totalTitleHeight = text.components.title.h + _options.header.titleSubtitlePadding + text.components.subtitle.h;
				y = y - (totalTitleHeight / 2) + text.components.title.h;
			} else {
				y += (text.components.title.h / 4);
			}
		}

		_svg.select("#title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function() {
		if (!text.components.subtitle.exists) {
			return;
		}

		_svg.selectAll(".subtitle")
			.data([_options.header.subtitle])
			.enter()
			.append("text")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
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
		if (text.components.title.exists) {
			var totalTitleHeight = text.components.title.h + _options.header.titleSubtitlePadding + text.components.subtitle.h;
			if (_options.header.location === "pie-center") {
				var pieCenter = math.getPieCenter();
				y = pieCenter.y;
				y = y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				y = totalTitleHeight;
			}
		} else {
			if (_options.header.location === "pie-center") {
				var footerPlusPadding = _options.misc.canvasPadding.bottom + text.components.footer.h;
				y = ((_options.size.canvasHeight - footerPlusPadding) / 2) + _options.misc.canvasPadding.top + (text.components.subtitle.h / 2);
			} else {
				y = _options.misc.canvasPadding.top + text.components.subtitle.h;
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
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
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

		helpers.whenIdExists("footer", text.positionFooter);
	},

	positionFooter: function() {
		var x;
		if (_options.footer.location === "bottom-left") {
			x = _options.misc.canvasPadding.left;
		} else if (_options.footer.location === "bottom-right") {
			x = _options.size.canvasWidth - text.components.footer.w - _options.misc.canvasPadding.right;
		} else {
			x = _options.size.canvasWidth / 2;
		}

		var d3 = helpers.getDimensions("footer");
		text.components.footer.h = d3.h;
		text.components.footer.w = d3.w;

		_svg.select("#footer")
			.attr("x", x)
			.attr("y", _options.size.canvasHeight - _options.misc.canvasPadding.bottom);
	}
};