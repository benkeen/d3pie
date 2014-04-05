// --------- math.js -----------
var math = {

	toRadians: function(degrees) {
		return degrees * (Math.PI / 180);
	},

	toDegrees: function(radians) {
		return radians * (180 / Math.PI);
	},

	computePieRadius: function(pie) {
		var size = pie.options.size;
		var canvasPadding = pie.options.misc.canvasPadding;

		// outer radius is either specified (e.g. through the generator), or omitted altogether
		// and calculated based on the canvas dimensions. Right now the estimated version isn't great - it should
		// be possible to calculate it to precisely generate the maximum sized pie, but it's fussy as heck. Something
		// for the next release.

		// first, calculate the default _outerRadius
		var w = size.canvasWidth - canvasPadding.left - canvasPadding.right;
		var h = size.canvasHeight;

		var outerRadius = ((w < h) ? w : h) / 2.8;
		var innerRadius, percent;

		// if the user specified something, use that instead
		if (size.pieOuterRadius !== null) {
			if (/%/.test(size.pieOuterRadius)) {
				percent = parseInt(size.pieOuterRadius.replace(/[\D]/, ""), 10);
				percent = (percent > 99) ? 99 : percent;
				percent = (percent < 0) ? 0 : percent;
				var smallestDimension = (w < h) ? w : h;
				outerRadius = Math.floor((smallestDimension / 100) * percent) / 2;
			} else {
				// TODO bounds checking
				outerRadius = parseInt(size.pieOuterRadius, 10);
			}
		}

		// inner radius
		if (/%/.test(size.pieInnerRadius)) {
			percent = parseInt(size.pieInnerRadius.replace(/[\D]/, ""), 10);
			percent = (percent > 99) ? 99 : percent;
			percent = (percent < 0) ? 0 : percent;
			innerRadius = Math.floor((outerRadius / 100) * percent);
		} else {
			innerRadius = parseInt(size.pieInnerRadius, 10);
		}

		pie.innerRadius = innerRadius;
		pie.outerRadius = outerRadius;
	},

	getTotalPieSize: function(data) {
		var totalSize = 0;
		for (var i=0; i<data.length; i++) {
			totalSize += data[i].value;
		}
		return totalSize;
	},

	sortPieData: function(pie) {
		var data      = pie.options.data.content;
		var sortOrder = pie.options.data.sortOrder;

		switch (sortOrder) {
			case "none":
				// do nothing.
				break;
			case "random":
				data = helpers.shuffleArray(data);
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

	// var pieCenter = math.getPieCenter();
	getPieTranslateCenter: function(pieCenter) {
		return "translate(" + pieCenter.x + "," + pieCenter.y + ")"
	},

	/**
	 * Used to determine where on the canvas the center of the pie chart should be. It takes into account the
	 * height and position of the title, subtitle and footer, and the various paddings.
	 * @private
	 */
	calculatePieCenter: function(pie) {
		var headerLocation = pie.options.header.location;
		var canvasPadding = pie.options.misc.canvasPadding;
		var titleSubtitlePadding = pie.options.header.titleSubtitlePadding;
		var canvasWidth = pie.options.size.canvasWidth;
		var canvasHeight = pie.options.size.canvasHeight;
		var pieCenterOffset = pie.options.misc.pieCenterOffset;

		var hasTopTitle    = (pie.textComponents.title.exists && headerLocation !== "pie-center");
		var hasTopSubtitle = (pie.textComponents.subtitle.exists && headerLocation !== "pie-center");

		var headerOffset = canvasPadding.top;
		if (hasTopTitle && hasTopSubtitle) {
			headerOffset += pie.textComponents.title.h + titleSubtitlePadding + pie.textComponents.subtitle.h;
		} else if (hasTopTitle) {
			headerOffset += pie.textComponents.title.h;
		} else if (hasTopSubtitle) {
			headerOffset = pie.textComponents.subtitle.h;
		}

		var footerOffset = 0;
		if (pie.textComponents.footer.exists) {
			footerOffset = pie.textComponents.footer.h + canvasPadding.bottom;
		}

		var x = ((canvasWidth - canvasPadding.left - canvasPadding.right) / 2) + canvasPadding.left;
		var y = ((canvasHeight - footerOffset - headerOffset) / 2) + headerOffset;

		x += pieCenterOffset.x;
		y += pieCenterOffset.y;

		pie.pieCenter = { x: x, y: y };
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
		var rads = math.toRadians(a);
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
			angle = Math.atan2(pt.x, -pt.y); // Note: different coordinate system

		angle = (angle < 0) ? (angle + Math.PI * 2) : angle;

		return (r1 * r1 <= dist) && (dist <= r2 * r2) &&
			(theta1 <= angle) && (angle <= theta2);
	}
};