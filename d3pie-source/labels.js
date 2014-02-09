// --------- labels.js -----------
d3pie.labels = {

	/**
	 * Add the labels to the pie.
	 * @param options
	 * @private
	 */
	add: function() {

		// 1. Add the main label (not positioned yet)
		var labelGroup = _svg.selectAll(".labelGroup")
			.data(
			_options.data.filter(function(d) { return d.value; }),
			function(d) { return d.label; }
		)
			.enter()
			.append("g")
			.attr("class", "labelGroup")
			.attr("id", function(d, i) {
				return "labelGroup" + i;
			})
			.attr("transform", d3pie.helpers.getPieTranslateCenter);

		labelGroup.append("text")
			.attr("class", "segmentLabel")
			.attr("id", function(d, i) { return "label" + i; })
			.text(function(d) { return d.label; })
			.style("font-size", "8pt")
			.style("fill", _options.labels.labelColor)
			.style("opacity", 0);

		// 2. Add the percentage label (not positioned yet)


		// 3. Add the value label (not positioned yet)

		/*
		 labelGroup.append("text")
		 .text(function(d) {
		 return Math.round((d.value / _totalSize) * 100) + "%";
		 })
		 .attr("class", "pieShare")
		 .attr("transform", function(d, i) {
		 var angle = _getSegmentRotationAngle(d, i, _data, _totalSize);
		 var labelRadius = _outerRadius + 30;
		 var c = _arc.centroid(d),
		 x = c[0],
		 y = c[1],
		 h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

		 return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
		 })
		 .style("fill", options.labels.labelPercentageColor)
		 .style("font-size", "8pt")
		 .style("opacity", function() {
		 return (options.effects.loadEffect === "fadein") ? 0 : 1;
		 });
		 */

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;
			d3.selectAll("text.segmentLabel")
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

		// now place the labels in reasonable locations. This needs to run in a timeout because we need the actual
		// text elements in place
		setTimeout(d3pie.labels.addLabelLines, 1);
	},


	// this both adds the lines and positions the labels
	addLabelLines: function() {
		var lineMidPointDistance = _options.misc.labelPieDistance - (_options.misc.labelPieDistance / 4);
		var circleCoordGroups = [];

		d3.selectAll(".segmentLabel")
			.style("opacity", 0)
			.attr("dx", function(d, i) {
				var labelDimensions = document.getElementById("label" + i).getBBox();

				var angle = d3pie.math.getSegmentRotationAngle(i, _options.data, _totalSize);
				var nextAngle = 360;
				if (i < _options.data.length - 1) {
					nextAngle = d3pie.math.getSegmentRotationAngle(i+1, _options.data, _totalSize);
				}

				var segmentCenterAngle = angle + ((nextAngle - angle) / 2);
				var remainderAngle = segmentCenterAngle % 90;
				var quarter = Math.floor(segmentCenterAngle / 90);

				var labelXMargin = 10; // the x-distance of the label from the end of the line [TODO configurable?]

				var p1, p2, p3, labelX;
				switch (quarter) {
					case 0:
						var calc1 = Math.sin(d3pie.helpers.toRadians(remainderAngle));
						labelX = calc1 * (_outerRadius + _options.misc.labelPieDistance) + labelXMargin;
						p1     = calc1 * _outerRadius;
						p2     = calc1 * (_outerRadius + lineMidPointDistance);
						p3     = calc1 * (_outerRadius + _options.misc.labelPieDistance) + 5;
						break;
					case 1:
						var calc2 = Math.cos(d3pie.helpers.toRadians(remainderAngle));
						labelX = calc2 * (_outerRadius + _options.misc.labelPieDistance) + labelXMargin;
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance);
						p3     = calc2 * (_outerRadius + _options.misc.labelPieDistance) + 5;
						break;
					case 2:
						var calc3 = Math.sin(d3pie.helpers.toRadians(remainderAngle));
						labelX = -calc3 * (_outerRadius + _options.misc.labelPieDistance) - labelDimensions.width - labelXMargin;
						p1     = -calc3 * _outerRadius;
						p2     = -calc3 * (_outerRadius + lineMidPointDistance);
						p3     = -calc3 * (_outerRadius + _options.misc.labelPieDistance) - 5;
						break;
					case 3:
						var calc4 = Math.cos(d3pie.helpers.toRadians(remainderAngle));
						labelX = -calc4 * (_outerRadius + _options.misc.labelPieDistance) - labelDimensions.width - labelXMargin;
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance);
						p3     = -calc4 * (_outerRadius + _options.misc.labelPieDistance) - 5;
						break;
				}
				circleCoordGroups[i] = [
					{ x: p1, y: null },
					{ x: p2, y: null },
					{ x: p3, y: null }
				];

				return labelX;
			})
			.attr("dy", function(d, i) {
				var labelDimensions = document.getElementById("label" + i).getBBox();
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

				switch (quarter) {
					case 0:
						var calc1 = Math.cos(d3pie.helpers.toRadians(remainderAngle));
						labelY = -calc1 * (_outerRadius + _options.misc.labelPieDistance);
						p1     = -calc1 * _outerRadius;
						p2     = -calc1 * (_outerRadius + lineMidPointDistance);
						p3     = -calc1 * (_outerRadius + _options.misc.labelPieDistance) - heightOffset;
						break;
					case 1:
						var calc2 = Math.sin(d3pie.helpers.toRadians(remainderAngle));
						labelY = calc2 * (_outerRadius + _options.misc.labelPieDistance);
						p1     = calc2 * _outerRadius;
						p2     = calc2 * (_outerRadius + lineMidPointDistance);
						p3     = calc2 * (_outerRadius + _options.misc.labelPieDistance) - heightOffset;
						break;
					case 2:
						var calc3 = Math.cos(d3pie.helpers.toRadians(remainderAngle));
						labelY = calc3 * (_outerRadius + _options.misc.labelPieDistance);
						p1     = calc3 * _outerRadius;
						p2     = calc3 * (_outerRadius + lineMidPointDistance);
						p3     = calc3 * (_outerRadius + _options.misc.labelPieDistance) - heightOffset;
						break;
					case 3:
						var calc4 = Math.sin(d3pie.helpers.toRadians(remainderAngle));
						labelY = -calc4 * (_outerRadius + _options.misc.labelPieDistance);
						p1     = -calc4 * _outerRadius;
						p2     = -calc4 * (_outerRadius + lineMidPointDistance);
						p3     = -calc4 * (_outerRadius + _options.misc.labelPieDistance) - heightOffset;
						break;
				}
				circleCoordGroups[i][0].y = p1;
				circleCoordGroups[i][1].y = p2;
				circleCoordGroups[i][2].y = p3;

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
			.attr("transform", d3pie.helpers.getPieTranslateCenter);

		var lineFunction = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });

		lineGroup.append("path")
			.attr("d", lineFunction)
			.attr("stroke", "#666666")
			.attr("stroke-width", 1)
			.attr("fill", "none");

		// fade in the labels when the load effect is complete - or immediately if there's no load effect
		var loadSpeed = (_options.effects.load.effect === "default") ? _options.effects.load.speed : 1;
		setTimeout(function() {
			var labelFadeInTime = (_options.effects.load.effect === "default") ? _options.effects.labelFadeInTime : 1;
			d3.selectAll("g.lineGroups")
				.transition()
				.duration(labelFadeInTime)
				.style("opacity", 1);
		}, loadSpeed);
	}
};