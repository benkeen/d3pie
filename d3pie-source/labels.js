// --------- labels.js -----------
d3pie.labels = {

	circleCoordGroups: [],
	dimensions: [],

	/**
	 * Add the outer labels to the pie. Un-positioned.
	 */
	addOuter: function() {
		var include = d3pie.labels.getIncludes(_options.labels.outside);

		// group the label groups into a single element (just for tidiness)
		var outerLabel = _svg.insert("g", ".outerLabel")
			.attr("class", "outerLabel");

		var labelGroup = outerLabel.selectAll(".outerLabelGroup")
			.data(
				_options.data.filter(function(d) { return d.value; }),
				function(d) { return d.label; }
			)
			.enter()
			.append("g")
			.attr("class", "outerLabelGroup")
			.attr("id", function(d, i) { return "outerLabelGroup" + i; })
			.attr("transform", d3pie.math.getPieTranslateCenter)
			.style("opacity", 0);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("class", "segmentOuterMainLabel")
				.attr("id", function(d, i) { return "labelMain" + i; })
				.text(function(d) { return d.label; })
				.style("font-size", _options.labels.mainLabel.fontSize)
				.style("font-family", _options.labels.mainLabel.font)
				.style("fill", _options.labels.mainLabel.color);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("class", "segmentOuterPercentage")
				.attr("id", function(d, i) { return "labelPercentage" + i; })
				.text(function(d) {
					return parseInt((d.value / _totalSize) * 100).toFixed(0) + "%";
				})
				.style("font-size", _options.labels.percentage.fontSize)
				.style("font-family", _options.labels.percentage.font)
				.style("fill", _options.labels.percentage.color);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("class", "segmentOuterValue")
				.attr("id", function(d, i) { return "labelValue" + i; })
				.text(function(d) { return d.value; })
				.style("font-size", _options.labels.value.fontSize)
				.style("font-family", _options.labels.value.font)
				.style("fill", _options.labels.value.color);
		}
	},

	/**
	 * Add the inner labels to the pie. Un-positioned.
	 */
	addInner: function() {
		var include = d3pie.labels.getIncludes(_options.labels.inside);

		// group the label groups into a single element (just for tidiness)
		var outerLabel = _svg.insert("g", ".innerLabel")
			.attr("class", "innerLabel");
	},

	positionOuterLabelElementsRelatively: function() {

		d3pie.labels.dimensions = [];

		// get the latest widths, heights
		var outerLabelGroups = $(".outerLabelGroup");
		for (var i=0; i<outerLabelGroups.length; i++) {
			var row = {};
			var mainLabel = $(outerLabelGroups[i]).find(".segmentOuterMainLabel");
			row.outerMainLabel = (mainLabel.length > 0) ? row.outerMainLabel = mainLabel[0].getBBox() : null;

			var percentage = $(outerLabelGroups[i]).find(".segmentOuterPercentage");
			row.outerPercentage = (percentage.length > 0) ? row.outerPercentage = percentage[0].getBBox() : null;

			var value = $(outerLabelGroups[i]).find(".segmentOuterValue");
			row.outerValue = (value.length > 0) ? row.outerValue = value[0].getBBox() : null;

			d3pie.labels.dimensions.push(row);
		}

		//if (label-value1)
//
//		outerMainLabel:  null,
//		outerPercentage: null,
//		outerValue:      null


	},

	// this both adds the lines
	addLabelLines: function() {
		if (!_options.labels.lines.enabled || _options.labels.outside === "none") {
			return;
		}

		// reset
		d3pie.labels.circleCoordGroups = [];

		d3.selectAll(".outerLabelGroup")
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				return d3pie.labels.getLabelGroupTransform(d, i);
			});

		var lineGroups = _svg.insert("g", ".pieChart")
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(d3pie.labels.circleCoordGroups)
			.enter()
			.append("g")
			.attr("class", "lineGroup")
			.attr("transform", d3pie.math.getPieTranslateCenter);

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", function(d, i) {
				var color;
				if (_options.labels.lines.color === "segment") {
					color = _options.styles.colors[i];
				} else {
					color = _options.labels.lines.color;
				}
				return color;
			})
			.attr("stroke-width", 1)
			.attr("fill", "none");
	},

	fadeInLabelsAndLines: function() {
		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;

			d3.selectAll(".outerLabelGroup")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);

			d3.selectAll("g.lineGroups")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);

			// once everything's done loading, trigger the onload callback if defined
			if ($.isFunction(_options.callbacks.onload)) {
				setTimeout(function() {
					try {
						_options.callbacks.onload();
					} catch (e) { }
				}, labelFadeInTime);
			}

		}, loadSpeed);
	},


	getIncludes: function(val) {
		var addMainLabel  = false;
		var addValue      = false;
		var addPercentage = false;
		switch (val) {
			case "label":
				addMainLabel = true;
				break;
			case "value":
				addValue = true;
				break;
			case "percentage":
				addPercentage = true;
				break;
			case "label-value1":
			case "label-value2":
				addMainLabel = true;
				addValue = true;
				break;
			case "label-percentage1":
			case "label-percentage2":
				addMainLabel = true;
				addPercentage = true;
				break;
		}
		return {
			mainLabel: addMainLabel,
			value: addValue,
			percentage: addPercentage
		};
	},


	getLabelGroupTransform: function(d, i) {
		var labelDimensions = document.getElementById("outerLabelGroup" + i).getBBox();
		var lineMidPointDistance = _options.labels.lines.length - (_options.labels.lines.length / 4);
		var angle = d3pie.math.getSegmentRotationAngle(i, _options.data, _totalSize);
		var nextAngle = 360;
		if (i < _options.data.length - 1) {
			nextAngle = d3pie.math.getSegmentRotationAngle(i+1, _options.data, _totalSize);
		}
		var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
		var remainderAngle = segmentCenterAngle % 90;
		var quarter = Math.floor(segmentCenterAngle / 90);

		var labelXMargin = 10; // the x-distance of the label from the end of the line [TODO configurable?]
		var xOffset = (_options.data[i].xOffset) ? _options.data[i].xOffset : 0;
		var heightOffset = labelDimensions.height / 5;
		var yOffset = (_options.data[i].yOffset) ? _options.data[i].yOffset : 0;

		var x1, x2, x3, groupX, y1, y2, y3, groupY;
		switch (quarter) {
			case 0:
				var xCalc1 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc1 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
				x1     = xCalc1 * _outerRadius;
				x2     = xCalc1 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = xCalc1 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;

				var yCalc1 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = -yCalc1 * (_outerRadius + _options.labels.lines.length);
				y1     = -yCalc1 * _outerRadius;
				y2     = -yCalc1 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = -yCalc1 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 1:
				var xCalc2 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc2 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
				x1     = xCalc2 * _outerRadius;
				x2     = xCalc2 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = xCalc2 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;

				var yCalc2 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc2 * (_outerRadius + _options.labels.lines.length);
				y1     = yCalc2 * _outerRadius;
				y2     = yCalc2 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc2 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 2:
				var xCalc3 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc3 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
				x1     = -xCalc3 * _outerRadius;
				x2     = -xCalc3 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = -xCalc3 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;

				var yCalc3 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc3 * (_outerRadius + _options.labels.lines.length);
				y1     = yCalc3 * _outerRadius;
				y2     = yCalc3 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc3 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;

			case 3:
				var xCalc4 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc4 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
				x1     = -xCalc4 * _outerRadius;
				x2     = -xCalc4 * (_outerRadius + lineMidPointDistance) + xOffset;
				x3     = -xCalc4 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;

				var calc4 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = -calc4 * (_outerRadius + _options.labels.lines.length);
				y1     = -calc4 * _outerRadius;
				y2     = -calc4 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = -calc4 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
				break;
		}

		d3pie.labels.circleCoordGroups[i] = [
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 }
		];

		groupX += xOffset;
		groupY += yOffset;

		var center = d3pie.math.getPieCenter();
		groupX += center.x;
		groupY += center.y;

		return "translate(" + groupX + "," + groupY + ")";
	}

};