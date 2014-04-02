// --------- text.js -----------
var text = {
	offscreenCoord: -10000,

	addTitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var headerLocation = pie.options.header.location;
		var titleInfo = pie.options.header.title;
		var svg = pie.svg;

		var title = svg.selectAll("." + cssPrefix + "title")
			.data([titleInfo])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("id", cssPrefix + "title")
			.attr("class", cssPrefix + "title")
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
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
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionTitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var pieCenter = pie.pieCenter;
		var textComponents = pie.textComponents;
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var svg = pie.svg;

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

		svg.select("#" + cssPrefix + "title")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function(pie) {
		var svg = pie.svg;
		var cssPrefix      = pie.cssPrefix;
		var headerLocation = pie.options.header.location;
		var subtitleInfo   = pie.options.header.subtitle;

		svg.selectAll("." + cssPrefix + "subtitle")
			.data([subtitleInfo])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
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
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionSubtitle: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var pieCenter = pie.pieCenter;
		var textComponents = pie.textComponents;
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var svg = pie.svg;

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
		svg.select("#" + cssPrefix + "subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addFooter: function(pie) {
		var svg = pie.svg;
		var cssPrefix = pie.cssPrefix;
		var footerSettings = pie.options.footer;

		svg.selectAll("." + cssPrefix + "footer")
			.data([footerSettings])
			.enter()
			.append("text")
			.text(function(d) { return d.text; })
			.attr("x", text.offscreenCoord)
			.attr("y", text.offscreenCoord)
			.attr("id", cssPrefix + "footer")
			.attr("class", cssPrefix + "footer")
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
			.style("font-size", function(d) { return d.fontSize; })
			.style("font-family", function(d) { return d.font; });
	},

	positionFooter: function(pie) {
		var cssPrefix = pie.cssPrefix;
		var footerLocation = pie.options.footer.location;
		var footerWidth = pie.textComponents.footer.w;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var canvasPadding = pie.options.misc.canvasPadding;
		var svg = pie.svg;

		var x;
		if (footerLocation === "bottom-left") {
			x = canvasPadding.left;
		} else if (footerLocation === "bottom-right") {
			x = canvasWidth - footerWidth - canvasPadding.right;
		} else {
			x = canvasWidth / 2; // TODO - shouldn't this also take into account padding?
		}

		svg.select("#" + cssPrefix + "footer")
			.attr("x", x)
			.attr("y", canvasHeight - canvasPadding.bottom);
	}
};