// --------- math.js -----------

/**
 * Contains all the math needed to figure out where to place things, etc.
 */
d3pie.math = {

	toRadians: function(degrees) {
		return degrees * (Math.PI / 180);
	},

	toDegrees: function(radians) {
		return radians * (180 / Math.PI);
	},

	computePieRadius: function() {
		// outer radius is either specified (e.g. through the generator), or omitted altogether
		// and calculated based on the canvas dimensions. Right now the estimated version isn't great - it should
		// be possible to calculate it to precisely generate the maximum sized pie, but it's fussy as heck

		// first, calculate the default _outerRadius
		var w = _options.size.canvasWidth - _options.misc.canvasPadding.left - _options.misc.canvasPadding.right;
		var h = _options.size.canvasHeight; // - headerHeight - _options.misc.canvasPadding.bottom - footerHeight);

		var outerRadius = ((w < h) ? w : h) / 2.8;
		var innerRadius;

		// if the user specified something, use that instead
		if (_options.size.pieOuterRadius !== null) {
			if (/%/.test(_options.size.pieOuterRadius)) {
				var percent = parseInt(_options.size.pieOuterRadius.replace(/[\D]/, ""), 10);
				percent = (percent > 99) ? 99 : percent;
				percent = (percent < 0) ? 0 : percent;
				var smallestDimension = (w < h) ? w : h;
				outerRadius = Math.floor((smallestDimension / 100) * percent) / 2;
			} else {
				// blurgh! TODO bounds checking
				outerRadius = parseInt(_options.size.pieOuterRadius, 10);
			}
		}

		// inner radius
		if (/%/.test(_options.size.pieInnerRadius)) {
			var percent = parseInt(_options.size.pieInnerRadius.replace(/[\D]/, ""), 10);
			percent = (percent > 99) ? 99 : percent;
			percent = (percent < 0) ? 0 : percent;
			innerRadius = Math.floor((outerRadius / 100) * percent);
		} else {
			innerRadius = parseInt(_options.size.pieInnerRadius, 10);
		}

		return {
			inner: innerRadius,
			outer: outerRadius
		};
	},

	getTotalPieSize: function(data) {
		var totalSize = 0;
		for (var i=0; i<data.length; i++) {
			totalSize += data[i].value;
		}
		return totalSize;
	},

	sortPieData: function(data, sortOrder) {
		switch (sortOrder) {
			case "none":
				// do nothing.
				break;
			case "random":
				data = d3pie.helpers.shuffleArray(data);
				break;
			case "value-asc":
				data.sort(function(a, b) { return (a.value < b.value) ? 1 : -1 });
				break;
			case "value-desc":
				data.sort(function(a, b) { return (a.value > b.value) ? 1 : -1 });
				break;
			case "label-asc":
				data.sort(function(a, b) { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1 });
				break;
			case "label-desc":
				data.sort(function(a, b) { return (a.label.toLowerCase() < b.label.toLowerCase()) ? 1 : -1 });
				break;
		}
		return data;
	},

	getPieTranslateCenter: function() {
		var pieCenter = d3pie.math.getPieCenter();
		return "translate(" + pieCenter.x + "," + pieCenter.y + ")"
	},

	/**
	 * Used to determine where on the canvas the center of the pie chart should be. It takes into account the
	 * height and position of the title, subtitle and footer, and the various paddings.
	 * @private
	 */
	getPieCenter: function() {

		// TODO MEMOIZE (needs invalidation, too)
		var hasTopTitle    = (_hasTitle && _options.header.location !== "pie-center");
		var hasTopSubtitle = (_hasSubtitle && _options.header.location !== "pie-center");

		var headerOffset = _options.misc.canvasPadding.top;
		if (hasTopTitle && hasTopSubtitle) {
			headerOffset += _componentDimensions.title.h + _options.misc.titleSubtitlePadding + _componentDimensions.subtitle.h;
		} else if (hasTopTitle) {
			headerOffset += _componentDimensions.title.h;
		} else if (hasTopSubtitle) {
			headerOffset = _componentDimensions.subtitle.h;
		}

		var footerOffset = 0;
		if (_hasFooter) {
			footerOffset = _componentDimensions.footer.h + _options.misc.canvasPadding.bottom;
		}

		var x = ((_options.size.canvasWidth - _options.misc.canvasPadding.left - _options.misc.canvasPadding.right) / 2) + _options.misc.canvasPadding.left;
		var y = ((_options.size.canvasHeight - footerOffset - headerOffset) / 2) + headerOffset;

		return { x: x, y: y };
	},

	arcTween: function(b) {
		var i = d3.interpolate({ value: 0 }, b);
		return function(t) {
			return _arc(i(t));
		};
	},

	getSegmentRotationAngle: function(index, data, totalSize) {
		var val = 0;
		for (var i=0; i<index; i++) {
			try {
				val += data[i].value;
			} catch (e) {
				console.error("error in _getSegmentRotationAngle:", data, i);
			}
		}
		return (val / totalSize) * 360;
	}
};