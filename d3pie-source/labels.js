// --------- labels.js -----------
d3pie.labels = {

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
			.attr("transform", d3pie.math.getPieTranslateCenter);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("class", "segmentOuterLabel")
				.attr("id", function(d, i) { return "labelMain" + i; })
				.text(function(d) { return d.label; })
				.style("font-size", _options.labels.mainLabel.fontSize)
				.style("font-family", _options.labels.mainLabel.font)
				.style("fill", _options.labels.mainLabel.color)
				.style("opacity", 0);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("class", "segmentOuterLabel")
				.attr("id", function(d, i) { return "labelPercentage" + i; })
				.text(function(d) {
					return parseInt((d.value / _totalSize) * 100).toFixed(0) + "%";
				})
				.style("font-size", _options.labels.percentage.fontSize)
				.style("font-family", _options.labels.percentage.font)
				.style("fill", _options.labels.percentage.color)
				.style("opacity", 0);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("class", "segmentOuterLabel")
				.attr("id", function(d, i) { return "labelValue" + i; })
				.text(function(d) { return d.value; })
				.style("font-size", _options.labels.value.fontSize)
				.style("font-family", _options.labels.value.font)
				.style("fill", _options.labels.value.color)
				.style("opacity", 0);
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

	// this both adds the lines
	addLabelLines: function() {
		if (!_options.labels.lines.enabled || _options.labels.outside === "none") {
			return;
		}

		var lineMidPointDistance = _options.labels.lines.length - (_options.labels.lines.length / 4);
		var circleCoordGroups = [];

		d3.selectAll(".outerLabelGroup")
			.style("opacity", 0)
			.attr("dx", function(d, i) {
				var labelDimensions = document.getElementById("outerLabelGroup" + i).getBBox();

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

				var p1, p2, p3, labelX;
				switch (quarter) {
					case 0:
						var calc1 = Math.sin(d3pie.math.toRadians(remainderAngle));
						labelX = calc1 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
						p1     = calc1 * _outerRadius;
						p2     = calc1 * (_outerRadius + lineMidPointDistance) + xOffset;
						p3     = calc1 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;
						break;
					case 1:
						var calc2 = Math.cos(d3pie.math.toRadians(remainderAngle));
						labelX = calc2 * (_outerRadius + _options.labels.lines.length) + labelXMargin;
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance) + xOffset;
						p3     = calc2 * (_outerRadius + _options.labels.lines.length) + 5 + xOffset;
						break;
					case 2:
						var calc3 = Math.sin(d3pie.math.toRadians(remainderAngle));
						labelX = -calc3 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
						p1     = -calc3 * _outerRadius;
						p2     = -calc3 * (_outerRadius + lineMidPointDistance) + xOffset;
						p3     = -calc3 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;
						break;
					case 3:
						var calc4 = Math.cos(d3pie.math.toRadians(remainderAngle));
						labelX = -calc4 * (_outerRadius + _options.labels.lines.length) - labelDimensions.width - labelXMargin;
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance) + xOffset;
						p3     = -calc4 * (_outerRadius + _options.labels.lines.length) - 5 + xOffset;
						break;
				}
				circleCoordGroups[i] = [
					{ x: p1, y: null },
					{ x: p2, y: null },
					{ x: p3, y: null }
				];

				labelX += xOffset;
				return labelX;
			})
			.attr("dy", function(d, i) {
				var labelDimensions = document.getElementById("outerLabelGroup" + i).getBBox();
				var heightOffset = labelDimensions.height / 5;

				var angle = d3pie.math.getSegmentRotationAngle(i, _options.data, _totalSize);
				var nextAngle = 360;
				if (i < _options.data.length - 1) {
					nextAngle = d3pie.math.getSegmentRotationAngle(i+1, _options.data, _totalSize);
				}
				var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
				var remainderAngle = (segmentCenterAngle % 90);
				var quarter = Math.floor(segmentCenterAngle / 90);
				var p1, p2, p3, labelY;
				var yOffset = (_options.data[i].yOffset) ? _options.data[i].yOffset : 0;

				switch (quarter) {
					case 0:
						var calc1 = Math.cos(d3pie.math.toRadians(remainderAngle));
						labelY = -calc1 * (_outerRadius + _options.labels.lines.length);
						p1     = -calc1 * _outerRadius;
						p2     = -calc1 * (_outerRadius + lineMidPointDistance) + yOffset;
						p3     = -calc1 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
						break;
					case 1:
						var calc2 = Math.sin(d3pie.math.toRadians(remainderAngle));
						labelY = calc2 * (_outerRadius + _options.labels.lines.length);
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance) + yOffset;
						p3     = calc2 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
						break;
					case 2:
						var calc3 = Math.cos(d3pie.math.toRadians(remainderAngle));
						labelY = calc3 * (_outerRadius + _options.labels.lines.length);
						p1     = calc3 * _outerRadius;
						p2     = calc3 * (_outerRadius + lineMidPointDistance) + yOffset;
						p3     = calc3 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
						break;
					case 3:
						var calc4 = Math.sin(d3pie.math.toRadians(remainderAngle));
						labelY = -calc4 * (_outerRadius + _options.labels.lines.length);
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance) + yOffset;
						p3     = -calc4 * (_outerRadius + _options.labels.lines.length) - heightOffset + yOffset;
						break;
				}
				circleCoordGroups[i][0].y = p1;
				circleCoordGroups[i][1].y = p2;
				circleCoordGroups[i][2].y = p3;

				labelY += yOffset;
				return labelY;
			});

		var lineGroups = _svg.insert("g", ".pieChart")
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(circleCoordGroups)
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

			// should apply to the labelGroup
			d3.selectAll("text.segmentOuterLabel")
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
	}

};