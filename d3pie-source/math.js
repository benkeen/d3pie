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
				data.sort(function(a, b) { return (a.value < b.value) ? -1 : 1 });
				break;
			case "value-desc":
				data.sort(function(a, b) { return (a.value < b.value) ? 1 : -1 });
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
			headerOffset += _componentDimensions.title.h + _options.header.titleSubtitlePadding + _componentDimensions.subtitle.h;
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

		x += _options.misc.pieCenterOffset.x;
		y += _options.misc.pieCenterOffset.y;

		return { x: x, y: y };
	},

	arcTween: function(b) {
		var i = d3.interpolate({ value: 0 }, b);
		return function(t) {
			return _arc(i(t));
		};
	},


	/**
	 * Rotates a point (x, y) around an axis (xm, ym) by degrees (a).
	 * @param x
	 * @param y
	 * @param xm
	 * @param ym
	 * @param a angle in degrees
	 * @returns {Array}
	 */
	rotate: function(x, y, xm, ym, a) {
		var cos = Math.cos,
			sin = Math.sin,

		a = a * Math.PI / 180, // convert to radians

		// subtract midpoints, so that midpoint is translated to origin and add it in the end again
		xr = (x - xm) * cos(a) - (y - ym) * sin(a) + xm,
		yr = (x - xm) * sin(a) + (y - ym) * cos(a) + ym;

		return { x: xr, y: yr };
	},

	/**
	 * Translates a point x, y by distance d, and by angle a.
	 * @param x
	 * @param y
	 * @param dist
	 * @param a angle in degrees
	 */
	translate: function(x, y, d, a) {
		var rads = d3pie.math.toRadians(a);
		return {
			x: x + d * Math.sin(rads),
			y: y - d * Math.cos(rads)
		};
	},

	// from: http://stackoverflow.com/questions/19792552/d3-put-arc-labels-in-a-pie-chart-if-there-is-enough-space
	pointIsInArc: function(pt, ptData, d3Arc) {
		// Center of the arc is assumed to be 0,0
		// (pt.x, pt.y) are assumed to be relative to the center
		var r1 = d3Arc.innerRadius()(ptData), // Note: Using the innerRadius
			r2 = d3Arc.outerRadius()(ptData),
			theta1 = d3Arc.startAngle()(ptData),
			theta2 = d3Arc.endAngle()(ptData);

		var dist = pt.x * pt.x + pt.y * pt.y,
			angle = Math.atan2(pt.x, -pt.y); // Note: different coordinate system.

		angle = (angle < 0) ? (angle + Math.PI * 2) : angle;

		return (r1 * r1 <= dist) && (dist <= r2 * r2) &&
			(theta1 <= angle) && (angle <= theta2);
	}
};