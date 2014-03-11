// --------- labels.js -----------
d3pie.labels = {

	outerLabelGroupData: [],
	lineCoordGroups: [],

	/**
	 * Adds the labels to the pie chart, but doesn't position them. There are two locations for the
	 * labels: inside (center) of the segments, or outside the segments on the edge.
	 * @param section "inner" or "outer"
	 * @param sectionDisplayType "percentage", "value", "label", "label-value1", etc.
	 */
	add: function(section, sectionDisplayType) {
		var include = d3pie.labels.getIncludes(sectionDisplayType);
		var settings = _options.labels;

		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var outerLabel = _svg.insert("g", ".labels-" + section)
			.attr("class", "labels-" + section);

		var labelGroup = outerLabel.selectAll(".labelGroup-" + section)
			.data(_options.data)
			.enter()
			.append("g")
			.attr("class", "labelGroup-" + section)
			.attr("id", function(d, i) { return "labelGroup" + i + "-" + section; })
			.style("opacity", 0);

		// 1. Add the main label
		if (include.mainLabel) {
			labelGroup.append("text")
				.attr("class", "segmentMainLabel-" + section)
				.attr("id", function(d, i) { return "segmentMainLabel" + i + "-" + section; })
				.text(function(d) { return d.label; })
				.style("font-size", settings.mainLabel.fontSize)
				.style("font-family", settings.mainLabel.font)
				.style("fill", settings.mainLabel.color);
		}

		// 2. Add the percentage label
		if (include.percentage) {
			labelGroup.append("text")
				.attr("class", "segmentPercentage-" + section)
				.attr("id", function(d, i) { return "segmentPercentage" + i + "-" + section; })
				.text(function(d) {
					var percent = (d.value / _totalSize) * 100;
					return percent.toFixed(_options.misc.percentageDecimalPlace) + "%";
				})
				.style("font-size", settings.percentage.fontSize)
				.style("font-family", settings.percentage.font)
				.style("fill", settings.percentage.color);
		}

		// 3. Add the value label
		if (include.value) {
			labelGroup.append("text")
				.attr("class", "segmentValue-" + section)
				.attr("id", function(d, i) { return "segmentValue" + i + "-" + section; })
				.text(function(d) { return d.value; })
				.style("font-size", settings.value.fontSize)
				.style("font-family", settings.value.font)
				.style("fill", settings.value.color);
		}
	},

	/**
	 * @param section "inner" / "outer"
	 */
	positionLabelElements: function(section, sectionDisplayType) {
		d3pie.labels["dimensions-" + section] = [];

		// get the latest widths, heights
		var labelGroups = $(".labelGroup-" + section);

		for (var i=0; i<labelGroups.length; i++) {
			var mainLabel = $(labelGroups[i]).find(".segmentMainLabel-" + section);
			var percentage = $(labelGroups[i]).find(".segmentPercentage-" + section);
			var value = $(labelGroups[i]).find(".segmentValue-" + section);

			d3pie.labels["dimensions-" + section].push({
				mainLabel: (mainLabel.length > 0) ? mainLabel[0].getBBox() : null,
				percentage: (percentage.length > 0) ? percentage[0].getBBox() : null,
				value: (value.length > 0) ? value[0].getBBox() : null
			});
		}

		var singleLinePad = 5;
		var dims = d3pie.labels["dimensions-" + section];
		switch (sectionDisplayType) {
			case "label-value1":
				d3.selectAll(".segmentValue-outer")
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-value2":
				d3.selectAll(".segmentValue-outer")
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
			case "label-percentage1":
				d3.selectAll(".segmentPercentage-outer")
					.attr("dx", function(d, i) { return dims[i].mainLabel.width + singleLinePad; });
				break;
			case "label-percentage2":
				d3.selectAll(".segmentPercentage-outer")
					.attr("dx", function(d, i) { return (dims[i].mainLabel.width / 2) - (dims[i].percentage.width / 2); })
					.attr("dy", function(d, i) { return dims[i].mainLabel.height; });
				break;
	 	}
	},

	computeLabelLinePositions: function() {
		d3pie.labels.lineCoordGroups = [];

		d3.selectAll(".labelGroup-outer")
			.each(function(d, i) { return d3pie.labels.computeLinePosition(i); });
	},

	computeLinePosition: function(i) {
		var angle = d3pie.segments.getSegmentAngle(i, { midpoint: true});
		var center = d3pie.math.getPieCenter();

		var originCoords = d3pie.math.rotate(center.x, center.y - _outerRadius, center.x, center.y, angle);
		var heightOffset = d3pie.labels.outerLabelGroupData[i].h / 5; // TODO check
		var labelXMargin = 6; // the x-distance of the label from the end of the line [TODO configurable]

		var quarter = Math.floor(angle / 90);
		var midPoint = 4;
		var x2, y2, x3, y3;
		switch (quarter) {
			case 0:
				x2 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin - ((d3pie.labels.outerLabelGroupData[i].x - labelXMargin - originCoords.x) / 2);
				y2 = d3pie.labels.outerLabelGroupData[i].y + ((originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / midPoint);
				x3 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 1:
				x2 = originCoords.x + (d3pie.labels.outerLabelGroupData[i].x - originCoords.x) / midPoint;
				y2 = originCoords.y + (d3pie.labels.outerLabelGroupData[i].y - originCoords.y) / midPoint;
				x3 = d3pie.labels.outerLabelGroupData[i].x - labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 2:
				var startOfLabelX = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				x2 = originCoords.x - (originCoords.x - startOfLabelX) / midPoint;
				y2 = originCoords.y + (d3pie.labels.outerLabelGroupData[i].y - originCoords.y) / midPoint;
				x3 = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
			case 3:
				var startOfLabel = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				x2 = startOfLabel + ((originCoords.x - startOfLabel) / midPoint);
				y2 = d3pie.labels.outerLabelGroupData[i].y + (originCoords.y - d3pie.labels.outerLabelGroupData[i].y) / midPoint;
				x3 = d3pie.labels.outerLabelGroupData[i].x + d3pie.labels.outerLabelGroupData[i].w + labelXMargin;
				y3 = d3pie.labels.outerLabelGroupData[i].y - heightOffset;
				break;
		}

		/*
		 * x1 / y1: the x/y coords of the start of the line, at the mid point of the segments arc on the pie circumference
		 * x2 / y2: if "curved" line style is being used, this is the midpoint of the line. Other
		 * x3 / y3: the end of the line; closest point to the label
		 */
		if (_options.labels.lines.style === "straight") {
			d3pie.labels.lineCoordGroups[i] = [
				{ x: originCoords.x, y: originCoords.y },
				{ x: x3, y: y3 }
			];
		} else {
			d3pie.labels.lineCoordGroups[i] = [
				{ x: originCoords.x, y: originCoords.y },
				{ x: x2, y: y2 },
				{ x: x3, y: y3 }
			];
		}
	},

	addLabelLines: function() {
		var lineGroups = _svg.insert("g", ".pieChart") // meaning, BEFORE .pieChart
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(d3pie.labels.lineCoordGroups)
			.enter()
			.append("g")
			.attr("class", "lineGroup");

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", function(d, i) {
				return (_options.labels.lines.color === "segment") ? _options.styles.colors[i] : _options.labels.lines.color;
			})
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.style("opacity", function(d, i) {
				var percentage = _options.labels.outer.hideWhenLessThanPercentage;
				var segmentPercentage = d3pie.segments.getPercentage(i);
				return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
			})
	},

	positionLabelGroups: function(section) {
		d3.selectAll(".labelGroup-" + section)
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				var x, y;
				if (section === "outer") {
					x = d3pie.labels.outerLabelGroupData[i].x;
					y = d3pie.labels.outerLabelGroupData[i].y;
				} else {
					var rotationAngle = d3pie.segments.getSegmentAngle(i);
					var location = d3pie.segments.getCentroid($("#segment" + i)[0]);

					console.log(location);

					var center = d3pie.math.getPieCenter();
					var result = d3pie.math.rotate(location.x, location.y, center.x, center.y, rotationAngle);

//					var center = d3pie.segments.getCentroid(document.getElementById("segment" + i));
//					var rotationAngle = d3pie.segments.getSegmentAngle(i);
////					var center = d3pie.math.getPieCenter();
//					var diff = (_outerRadius - _innerRadius) / 2;
//					x = (d3pie.labels.lineCoordGroups[i][0].x / 2) + center.x;
//					y = (d3pie.labels.lineCoordGroups[i][0].y / 2) + center.y;

					x = result.x;
					y = result.y;
				}

				return "translate(" + x + "," + y + ")";
			});
	},


	fadeInLabelsAndLines: function() {

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? 400 : 1; // 400 is hardcoded for the present

			d3.selectAll(".labelGroup-outer")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", function(d, i) {
					var percentage = _options.labels.outer.hideWhenLessThanPercentage;
					var segmentPercentage = d3pie.segments.getPercentage(i);
					return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
				});

			d3.selectAll(".labelGroup-inner")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", function(d, i) {
					var percentage = _options.labels.inner.hideWhenLessThanPercentage;
					var segmentPercentage = d3pie.segments.getPercentage(i);
					return (percentage !== null && segmentPercentage < percentage) ? 0 : 1;
				});

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

		// TODO refactor... somehow
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


	/**
	 * This does the heavy-lifting to compute the actual coordinates for the outer label groups. It does two things:
	 * 1. Make a first pass and position them in the ideal positions, based on the pie sizes
	 * 2. Do some basic collision avoidance.
	 */
	computeOuterLabelCoords: function() {
		// 1. figure out the ideal positions for the outer labels
		d3.selectAll(".labelGroup-outer")
			.each(function(d, i) { return d3pie.labels.getIdealOuterLabelPositions(i); });

		// 2. now adjust those positions to try to accommodate conflicts
		d3pie.labels.resolveOuterLabelCollisions();
	},

	/**
	 * This attempts to resolve label positioning collisions.
	 */
	resolveOuterLabelCollisions: function() {
		var size = _options.data.length;
		d3pie.labels.checkConflict(0, "clockwise", size);
		d3pie.labels.checkConflict(size-1, "anticlockwise", size);
	},

	checkConflict: function(currIndex, direction, size) {
		var currIndexHemisphere = d3pie.labels.outerLabelGroupData[currIndex].hs;
		if (direction === "clockwise" && currIndexHemisphere != "right") {
			return;
		}
		if (direction === "anticlockwise" && currIndexHemisphere != "left") {
			return;
		}
		var nextIndex = (direction === "clockwise") ? currIndex+1 : currIndex-1;

		// this is the current label group being looked at. We KNOW it's positioned properly (the first item
		// is always correct)
		var currLabelGroup = d3pie.labels.outerLabelGroupData[currIndex];

		// this one we don't know about. That's the one we're going to look at and move if necessary
		var examinedLabelGroup = d3pie.labels.outerLabelGroupData[nextIndex];

		var info = {
			labelHeights: d3pie.labels.outerLabelGroupData[0].h,
			center: d3pie.math.getPieCenter(),
			lineLength: (_outerRadius + _options.labels.outer.pieDistance),
			heightChange: d3pie.labels.outerLabelGroupData[0].h + 1 // 1 = padding
		};

		// loop through *ALL* label groups examined so far to check for conflicts. This is because when they're
		// very tightly fitted, a later label group may still appear high up on the page
		if (direction === "clockwise") {
			for (var i=0; i<=currIndex; i++) {
				var curr = d3pie.labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (d3pie.helpers.rectIntersect(curr, examinedLabelGroup)) {
					d3pie.labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		} else {
			for (var i=size-1; i>=currIndex; i--) {
				var curr = d3pie.labels.outerLabelGroupData[i];

				// if there's a conflict with this label group, shift the label to be AFTER the last known
				// one that's been properly placed
				if (d3pie.helpers.rectIntersect(curr, examinedLabelGroup)) {
					d3pie.labels.adjustLabelPos(nextIndex, currLabelGroup, info);
					break;
				}
			}
		}
		d3pie.labels.checkConflict(nextIndex, direction, size);
	},

	// does a little math to shift a label into a new position based on the last properly placed one
	adjustLabelPos: function(nextIndex, lastCorrectlyPositionedLabel, info) {
		var xDiff, yDiff, newXPos, newYPos;
		newYPos = lastCorrectlyPositionedLabel.y + info.heightChange;
		yDiff = info.center.y - newYPos;

		if (Math.abs(info.lineLength) > Math.abs(yDiff)) {
			xDiff = Math.sqrt((info.lineLength * info.lineLength) - (yDiff * yDiff));
		} else {
			xDiff = Math.sqrt((yDiff * yDiff) - (info.lineLength * info.lineLength));
		}

		// ahhh! info.lineLength is no longer a constant.....

		if (lastCorrectlyPositionedLabel.hs === "right") {
			newXPos = info.center.x + xDiff;
		} else {
			newXPos = info.center.x - xDiff - d3pie.labels.outerLabelGroupData[nextIndex].w;
		}

		if (!newXPos) {
			console.log(lastCorrectlyPositionedLabel.hs, xDiff)
		}

		d3pie.labels.outerLabelGroupData[nextIndex].x = newXPos;
		d3pie.labels.outerLabelGroupData[nextIndex].y = newYPos;
	},

	/**
	 * @param i 0-N where N is the dataset size - 1.
	 */
	getIdealOuterLabelPositions: function(i) {
		var labelGroupDims = document.getElementById("labelGroup" + i + "-outer").getBBox();
		var angle = d3pie.segments.getSegmentAngle(i, { midpoint: true });

		var center = d3pie.math.getPieCenter();
		var originalX = center.x;
		var originalY = center.y - (_outerRadius + _options.labels.outer.pieDistance);
		var newCoords = d3pie.math.rotate(originalX, originalY, center.x, center.y, angle);

		// if the label is on the left half of the pie, adjust the values
		var hemisphere = "right"; // hemisphere
		if (angle > 180) {
			newCoords.x -= (labelGroupDims.width + 8);
			hemisphere = "left";
		} else {
			newCoords.x += 8;
		}

		d3pie.labels.outerLabelGroupData[i] = {
			x: newCoords.x,
			y: newCoords.y,
			w: labelGroupDims.width,
			h: labelGroupDims.height,
			hs: hemisphere
		};
	}
};