// --------- text.js -----------

/**
 * Contains the code for the main text elements: title, subtitle + footer.
 */
var text = {

	offscreenCoord: -10000,

	addTextElementsOffscreen: function(cssPrefix, textComponents, headerInfo) {
		if (textComponents.title.exists) {
			text.addTitle(cssPrefix, headerInfo.location, headerInfo.title);
		}
		if (textComponents.subtitle.exists) {
			text.addSubtitle(cssPrefix, headerInfo.location, headerInfo.subtitle);
		}
	},

	addTitle: function(cssPrefix, headerLocation, titleInfo) {
		var title = this.svg.selectAll(".title")
			.data([titleInfo.title])
			.enter()
			.append("text")
			.attr("id", cssPrefix + "title")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("class", cssPrefix + "title")
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
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionHeadings: function(a, b, c, d, e, f, g, h) {
		text.positionTitle(a, b, c, d, e, f, g, h);
		text.positionSubtitle(a, b, c, d, e, f, g, h);
	},

	positionTitle: function(cssPrefix, pieCenter, textComponents, headerLocation, canvasPadding, canvasWidth, canvasHeight, titleSubtitlePadding) {
		var x = (headerLocation === "top-left") ? canvasPadding.left : canvasWidth / 2;
		var y = canvasPadding.top + textComponents.title.h;

		if (headerLocation === "pie-center") {
			y = pieCenter.y;

			// still not fully correct
			if (textComponents.subtitle.exists) {
				var totalTitleHeight = textComponents.title.h + titleSubtitlePadding + textComponents.subtitle.h;
				y = y - (totalTitleHeight / 2) + textComponents.title.h;
			} else {
				y += (textComponents.title.h / 4);
			}
		}

		this.svg.select("#" + cssPrefix + "title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function(cssPrefix, headerLocation, subtitleInfo) {
		this.svg.selectAll("." + cssPrefix + "subtitle")
			.data([subtitleInfo])
			.enter()
			.append("text")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", cssPrefix + "subtitle")
			.attr("class", cssPrefix + "subtitle")
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
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionSubtitle: function(cssPrefix, pieCenter, textComponents, headerLocation, canvasPadding, canvasWidth, canvasHeight, titleSubtitlePadding) {
		var x = (headerLocation === "top-left") ? canvasPadding.left : canvasWidth / 2;
		var y;
		if (textComponents.title.exists) {
			var totalTitleHeight = textComponents.title.h + titleSubtitlePadding + textComponents.subtitle.h;
			if (headerLocation === "pie-center") {
				y = pieCenter.y - (totalTitleHeight / 2) + totalTitleHeight;
			} else {
				y = totalTitleHeight;
			}
		} else {
			if (headerLocation === "pie-center") {
				var footerPlusPadding = canvasPadding.bottom + textComponents.footer.h;
				y = ((canvasHeight - footerPlusPadding) / 2) + canvasPadding.top + (textComponents.subtitle.h / 2);
			} else {
				y = canvasPadding.top + textComponents.subtitle.h;
			}
		}
		this.svg.select("#" + cssPrefix + "subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function(footerSettings) {
		this.svg.selectAll(".footer")
			.data([footerSettings])
			.enter()
			.append("text")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", "footer")
			.attr("class", "footer")
			.attr("text-anchor", function() {
				var location = "left";
				if (footerSettings.location === "bottom-center") {
					location = "middle";
				} else if (footerSettings.location === "bottom-right") {
					location = "left"; // on purpose. We have to change the x-coord to make it properly right-aligned
				}
				return location;
			})
			.attr("fill", function(d) { return d.color; })
			.text(function(d) { return d.text; })
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionFooter: function(cssPrefix, footerLocation, footerWidth, canvasWidth, canvasHeight, canvasPadding) {
		var x;
		if (footerLocation === "bottom-left") {
			x = canvasPadding.left;
		} else if (footerLocation === "bottom-right") {
			x = canvasWidth - footerWidth - canvasPadding.right;
		} else {
			x = canvasWidth / 2; // TODO - shouldn't this also take into account padding?
		}

		this.svg.select("#" + cssPrefix + "footer")
			.attr("x", x)
			.attr("y", canvasHeight - canvasPadding.bottom);
	}
};