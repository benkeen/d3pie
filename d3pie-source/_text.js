// --------- text.js -----------

/**
 * Contains the code for the main text elements: title, subtitle + footer.
 */
var text = {

	offscreenCoord: -10000,

	storeComponentDimensions: function(textComponents) {
		if (textComponents.title.exists) {
			var d1 = helpers.getDimensions("title");
			textComponents.title.h = d1.h;
			textComponents.title.w = d1.w;
		}
		if (textComponents.subtitle.exists) {
			var d2 = helpers.getDimensions("subtitle");
			textComponents.subtitle.h = d2.h;
			textComponents.subtitle.w = d2.w;
		}
	},

	addTextElementsOffscreen: function(textComponents, headerInfo) {
		if (textComponents.title.exists) {
			text.addTitle(headerInfo.title);
		}
		if (textComponents.subtitle.exists) {
			text.addSubtitle(headerInfo.subtitle);
		}
	},

	/**
	 * Adds the Pie Chart title.
	 * @param titleData
	 * @private
	 */
	addTitle: function(headerInfo) {
		var title = this.svg.selectAll(".title").data([headerInfo.title]);
		title.enter()
			.append("text")
			.attr("id", "title")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("class", "title")
			.attr("text-anchor", function() {
				var location;
				if (headerInfo.location === "top-center" || headerInfo.location === "pie-center") {
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
		var x = (this.options.header.location === "top-left") ? this.options.misc.canvasPadding.left : this.options.size.canvasWidth / 2;
		var y = this.options.misc.canvasPadding.top + text.components.title.h;

		if (this.options.header.location === "pie-center") {
			var pieCenter = math.getPieCenter();
			y = pieCenter.y;

			// still not fully correct.
			if (text.components.subtitle.exists) {
				var totalTitleHeight = text.components.title.h + this.options.header.titleSubtitlePadding + text.components.subtitle.h;
				y = y - (totalTitleHeight / 2) + text.components.title.h;
			} else {
				y += (text.components.title.h / 4);
			}
		}

		this.svg.select("#title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function() {
		if (!text.components.subtitle.exists) {
			return;
		}

		this.svg.selectAll(".subtitle")
			.data([this.options.header.subtitle])
			.enter()
			.append("text")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", "subtitle")
			.attr("class", "subtitle")
			.attr("text-anchor", function() {
				var location;
				if (this.options.header.location === "top-center" || this.options.header.location === "pie-center") {
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
		var x = (this.options.header.location === "top-left") ? this.options.misc.canvasPadding.left : this.options.size.canvasWidth / 2;

		var y;
		if (text.components.title.exists) {
			var totalTitleHeight = text.components.title.h + this.options.header.titleSubtitlePadding + text.components.subtitle.h;
			if (this.options.header.location === "pie-center") {
				var pieCenter = math.getPieCenter();
				y = pieCenter.y;
				y = y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				y = totalTitleHeight;
			}
		} else {
			if (this.options.header.location === "pie-center") {
				var footerPlusPadding = this.options.misc.canvasPadding.bottom + text.components.footer.h;
				y = ((this.options.size.canvasHeight - footerPlusPadding) / 2) + this.options.misc.canvasPadding.top + (text.components.subtitle.h / 2);
			} else {
				y = this.options.misc.canvasPadding.top + text.components.subtitle.h;
			}
		}

		this.svg.select("#subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function(footerInfo) {
		this.svg.selectAll(".footer")
			.data([footerInfo])
			.enter()
			.append("text")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", "footer")
			.attr("class", "footer")
			.attr("text-anchor", function() {
				var location = "left";
				if (footerInfo.location === "bottom-center") {
					location = "middle";
				} else if (footerInfo.location === "bottom-right") {
					location = "left"; // on purpose. We have to change the x-coord to make it properly right-aligned
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionFooter: function(footerLocation, footerWidth, canvasWidth, canvasHeight, canvasPadding) {
		var x;
		if (footerLocation === "bottom-left") {
			x = canvasPadding.left;
		} else if (footerLocation === "bottom-right") {
			x = canvasWidth - footerWidth - canvasPadding.right;
		} else {
			x = canvasWidth / 2; // TODO - shouldn't this also take into account padding?
		}

		this.svg.select("#footer")
			.attr("x", x)
			.attr("y", canvasHeight - canvasPadding.bottom);
	}
};