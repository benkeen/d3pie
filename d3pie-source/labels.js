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
					return parseInt((d.value / _totalSize) * 100).toFixed(0) + "%"; // TODO
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

	addLabelLines: function() {
		var lineGroups = _svg.insert("g", ".pieChart") // meaning, BEFORE .pieChart
			.attr("class", "lineGroups")
			.style("opacity", 0);

		var lineGroup = lineGroups.selectAll(".lineGroup")
			.data(d3pie.labels.lineCoordGroups)
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

	positionLabelGroups: function(section) {

		d3.selectAll(".labelGroup-" + section)
			.style("opacity", 0)
			.attr("transform", function(d, i) {
				var x, y;
				if (section === "outer") {
					x = d3pie.labels.outerLabelGroupData[i].x;
					y = d3pie.labels.outerLabelGroupData[i].y;
				} else {
					var center = d3pie.segments.getCentroid(document.getElementById("segment" + i));

					//console.log(i, _options.data, _totalSize);
					var rotationAngle = d3pie.segments.getSegmentAngle(i);

//					var center = d3pie.math.getPieCenter();
					var diff = (_outerRadius - _innerRadius) / 2;

					x = (d3pie.labels.lineCoordGroups[i][0].x / 2) + center.x;
					y = (d3pie.labels.lineCoordGroups[i][0].y / 2) + center.y;
				}

				return "translate(" + x + "," + y + ")";
			});
	},


	fadeInLabelsAndLines: function() {

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;

			d3.selectAll(".labelGroup-outer,.labelGroup-inner")
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

		// TODO refactor... somehow.
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
		//d3pie.labels.lineCoordGroups = [];

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
		var dir = d3pie.labels.getCollisionDetectionCheckDirection();
		if (dir === "start") { // should be "clockwise", "anticlockwise"
			var allConflictsResolved = d3pie.labels.checkConflict(0, _options.data.length);
		} else {

		}
	},


	checkConflict: function(index, size) {
		var currLabelGroup = d3pie.labels.outerLabelGroupData[index];
		var nextLabelGroup = d3pie.labels.outerLabelGroupData[index+1];

		// right hemisphere: expand the width and height of the currLabelGroup by a huge amount. This will
		// ensure the
//		currLabelGroup.h = 10000;
//		currLabelGroup.w = 10000;

		if (d3pie.helpers.rectIntersect(currLabelGroup, nextLabelGroup)) {

			if (currLabelGroup.hs === "right") {
				console.log(index + " and next one intersect");

				var labelHeights = d3pie.labels.outerLabelGroupData[index].h;

				// calculate a new position for the next label group
				var center = d3pie.math.getPieCenter();

				// length of line from origin to new location (and old - it's consistent!)
				var lineLength = (_outerRadius + _options.labels.lines.length); // var originalY = center.y -
				var heightChange = labelHeights + 5; // 5 is padding between the two
				var xDiff = Math.sqrt((lineLength * lineLength) - (heightChange * heightChange));

				var newYPos = currLabelGroup.y - heightChange;
				var newXPos = center.x + xDiff;

				//console.log("old: ", ); //newXPos, newYPos
//				d3pie.labels.outerLabelGroupData[index+1].x = newXPos
//				d3pie.labels.outerLabelGroupData[index+1].y = newYPos;
			}
		}

		if (index+1 < size -1) {
			d3pie.labels.checkConflict(index+1, size);
		}

	},

	compare: function(r1, r2) {

	},



	// helper function to make an educated guess about where the label space conflicts are most going to lie: at the
	// start or end?
	getCollisionDetectionCheckDirection: function() {

		// this examines the full data set to see which half of the pie contains the most labels. Used in the collision
		// sort algorithm
		var getLargerPieSide = function() {
			var leftCount = 0;
			var rightCount = 0;
			for (var i=0; i<_options.data.length; i++) {
				var midpointAngle = d3pie.segments.getSegmentAngle(i, { midpoint: true });
				if (midpointAngle > 180) {
					leftCount++
				} else {
					rightCount++
				}
			}
			console.log("left: ", leftCount, " - right: ", rightCount);
			return (leftCount > rightCount) ? "left" : "right";
		};

		var algorithmStartPoint = "start";
		if (_options.misc.dataSortOrder == "value-asc") {
			algorithmStartPoint = "start";
		} else if (_options.misc.dataSortOrder == "value-desc") {
			algorithmStartPoint = "end";
		} else {
			algorithmStartPoint = (getLargerPieSide() === "left") ? "end" : "start";
		}

		return algorithmStartPoint;
	},


	/**
	 *
	 * @param i 0-N where N is the dataset size - 1.
	 */
	getIdealOuterLabelPositions: function(i) {
		var labelGroupDims = document.getElementById("labelGroup" + i + "-outer").getBBox();
		var angle = d3pie.segments.getSegmentAngle(i, { midpoint: true });

		var center = d3pie.math.getPieCenter();
		var originalX = center.x;
		var originalY = center.y - (_outerRadius + _options.labels.lines.length);

		var newCoords = d3pie.math.rotate(originalX, originalY, center.x, center.y, angle);

		// if the label is on the left half of the pie, adjust for the
		var hemisphere = "right"; // hemisphere
		if (angle > 180) {
			newCoords.x -= labelGroupDims.width;
			hemisphere = "left";
		}

		d3pie.labels.outerLabelGroupData[i] = {
			x: newCoords.x,
			y: newCoords.y,
			w: labelGroupDims.width,
			h: labelGroupDims.height,
			hs: hemisphere
		};
	}


	/**
	 * TODO: this function is doing too much. It's currently:
	 * - figuring out the coordinates for the label lines
	 * - figuring out the coordinates for the outer label groups.
	 *
	 * It's also confusing as sod. And badly named. And an asshole.
	getLabelGroupTransform: function(d, i) {
		var labelDimensions = document.getElementById("labelGroup" + i + "-outer").getBBox();

		var lineLength = _options.labels.lines.length;
		var lineMidPointDistance = lineLength - (lineLength / 4);
		var angle = d3pie.segments.getSegmentAngle(i);

		var nextAngle = 360;
		if (i < _options.data.length - 1) {
			nextAngle = d3pie.segments.getSegmentAngle(i+1);
		}

		var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
		var remainderAngle = segmentCenterAngle % 90;
		var quarter = Math.floor(segmentCenterAngle / 90);


		var labelXMargin = 10; // the x-distance of the label from the end of the line [TODO configurable?]
		var xOffset = (_options.data[i].xOffset) ? _options.data[i].xOffset : 0;
		var heightOffset = labelDimensions.height / 5;
		var yOffset = (_options.data[i].yOffset) ? _options.data[i].yOffset : 0;
		var center = d3pie.math.getPieCenter();

//		x1 / y1: the x/y coords of the start of the line, at the mid point of the segments arc on the pie circumference
//	    x2 / y2: the midpoint of the line
//		x3 / y3: the end of the line; closest point to the label
//		groupX / groupX: the coords of the label group

		var x1, x2, x3, groupX, y1, y2, y3, groupY, outerGroupX, outerGroupY;
		switch (quarter) {
			case 0:
				var xCalc1 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc1 * (_outerRadius + lineLength) + labelXMargin;
				x1     = xCalc1 * _outerRadius;
				x2     = xCalc1 * (_outerRadius + lineMidPointDistance);
				x3     = xCalc1 * (_outerRadius + lineLength) + 5 + xOffset; // TODO what's this mysterious "5"?

				var yCalc1 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = -yCalc1 * (_outerRadius + lineLength);
				y1     = -yCalc1 * _outerRadius;
				y2     = -yCalc1 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = -yCalc1 * (_outerRadius + lineLength) - heightOffset + yOffset;
				break;

			case 1:
				var xCalc2 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = xCalc2 * (_outerRadius + lineLength) + labelXMargin;
				x1     = xCalc2 * _outerRadius;
				x2     = xCalc2 * (_outerRadius + lineMidPointDistance);
				x3     = xCalc2 * (_outerRadius + lineLength) + 5 + xOffset;

				var yCalc2 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc2 * (_outerRadius + lineLength);
				y1     = yCalc2 * _outerRadius;
				y2     = yCalc2 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc2 * (_outerRadius + lineLength) - heightOffset + yOffset;
				break;

			case 2:
				var xCalc3 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc3 * (_outerRadius + lineLength) - labelDimensions.width - labelXMargin;
				x1     = -xCalc3 * _outerRadius;
				x2     = -xCalc3 * (_outerRadius + lineMidPointDistance);
				x3     = -xCalc3 * (_outerRadius + lineLength) - 5 + xOffset;

				var yCalc3 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupY = yCalc3 * (_outerRadius + lineLength);
				y1     = yCalc3 * _outerRadius;
				y2     = yCalc3 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3     = yCalc3 * (_outerRadius + lineLength) - heightOffset + yOffset;
				break;

			case 3:
				var xCalc4 = Math.cos(d3pie.math.toRadians(remainderAngle));
				groupX = -xCalc4 * (_outerRadius + lineLength) - labelDimensions.width - labelXMargin;
				x1     = -xCalc4 * _outerRadius;
				x2     = -xCalc4 * (_outerRadius + lineMidPointDistance);

				x3 = -xCalc4 * (_outerRadius + lineLength) - 5 + xOffset;

				var calc4 = Math.sin(d3pie.math.toRadians(remainderAngle));
				groupY = -calc4 * (_outerRadius + lineLength);
				y1     = -calc4 * _outerRadius;
				y2     = -calc4 * (_outerRadius + lineMidPointDistance) + yOffset;
				y3 = -calc4 * (_outerRadius + lineLength) - heightOffset + yOffset;
				break;
		}

		d3pie.labels.lineCoordGroups[i] = [
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 }
		];

		d3pie.labels.outerGroupTranslateX[i] = groupX + xOffset + center.x;
		d3pie.labels.outerGroupTranslateY[i] = groupY + yOffset + center.y;
	}
*/
};