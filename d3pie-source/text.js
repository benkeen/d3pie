// --------- text.js -----------

/**
 * Contains the code pertaining to the
 */
d3pie.text = {

	offscreenCoord: -10000,


	addTextElementsOffscreen: function() {
		if (_hasTitle) {
			d3pie.text.addTitle();
		}
		if (_hasSubtitle) {
			d3pie.text.addSubtitle();
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
			.attr("x", d3.text.offscreenCoord)
			.attr("y", d3.text.offscreenCoord)
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


		var dimens = d3pie.helpers.getDimensions("title");
		_componentDimensions.title.h = dimens.height;
		_componentDimensions.title.w = dimens.width;
	},

	positionTitle: function() {
		_componentDimensions.title.h = d3pie.helpers.getHeight("title");
		var x = (_options.header.location === "top-left") ? _options.misc.canvasPadding.left : _options.size.canvasWidth / 2;
		var y;

		if (_options.header.location === "pie-center") {

			// this is the exact vertical center
			y = ((_options.size.canvasHeight - _options.misc.canvasPadding.bottom) / 2) + _options.misc.canvasPadding.top + (_componentDimensions.title.h / 2);

			// special clause. We want to adjust the title to be slightly higher in the event of their being a subtitle
			if (_hasSubtitle) {
	//				_componentDimensions.subtitle.h = _getTitleHeight();
	//				var titleSubtitlePlusPaddingHeight = _componentDimensions.subtitle.h + _options.misc.titleSubtitlePadding + _componentDimensions.title.h;
				//y -= (subtitleHeight / 2);
			}

		} else {
			y = (_options.header.location === "pie-center") ? _options.size.canvasHeight / 2 : _options.misc.canvasPadding.top + _componentDimensions.title.h;
		}

		_svg.select("#title")
			.attr("x", x)
			.attr("y", y);
	},

	positionSubtitle: function() {
		var subtitleElement = document.getElementById("subtitle");
		var dimensions = subtitleElement.getBBox();
		var x = (_options.header.location === "top-left") ? _options.misc.canvasPadding.left : _options.size.canvasWidth / 2;

		// when positioning the subtitle, take into account whether there's a title or not
		var y;
		if (_options.header.title.text !== "") {
			var titleY = parseInt(d3.select(document.getElementById("title")).attr("y"), 10);
			y = (_options.header.location === "pie-center") ? _options.size.canvasHeight / 2 : dimensions.height + _options.misc.titleSubtitlePadding + titleY;
		} else {
			y = (_options.header.location === "pie-center") ? _options.size.canvasHeight / 2 : dimensions.height + _options.misc.canvasPadding.top;
		}

		_svg.select("#subtitle")
			.attr("x", x)
			.attr("y", y);
	},

	addSubtitle: function() {
		if (_options.header.subtitle.text === "") {
			return;
		}

		_svg.selectAll(".subtitle")
			.data([_options.header.subtitle])
			.enter()
			.append("text")
			.attr("x", d3.text.offscreenCoord)
			.attr("y", d3.text.offscreenCoord)
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

		var dimens = d3pie.helpers.getDimensions("subtitle");
		_componentDimensions.subtitle.h = dimens.height;
		_componentDimensions.subtitle.w = dimens.width;
	},

	addFooter: function() {
		_svg.selectAll(".footer")
			.data([_options.footer])
			.enter()
			.append("text")
			.attr("x", d3.text.offscreenCoord)
			.attr("y", d3.text.offscreenCoord)
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

		d3pie.helpers.whenIdExists("footer", d3pie.text.positionFooter);
	},

	positionFooter: function() {
		var dimens = d3pie.helpers.getDimensions("footer");
		_componentDimensions.footer.h = dimens.h;
		_componentDimensions.footer.w = dimens.w;

		var x;
		if (_options.footer.location === "bottom-left") {
			x = _options.misc.canvasPadding.left;
		} else if (_options.footer.location === "bottom-right") {
			x = _options.size.canvasWidth - _componentDimensions.footer.w - _options.misc.canvasPadding.right;
		} else {
			x = _options.size.canvasWidth / 2;
		}
		_svg.select("#footer")
			.attr("x", x)
			.attr("y", _options.size.canvasHeight - _options.misc.canvasPadding.bottom);
	}
};