(function() {

	var _defaultSettings = {

		// required
		targetElement: null,
		data: [],
		w: 500,
		h: 400,

		// optionals
		title: "",
		slideInSpeed: 900,
		labelFadeInTime: 500,
		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"],
		innerRadius: 0,
		outerRadius: 150, // TODO this should be calculated now
		percentOrValue: "percent"
	};

	// populated onload
	var _settings = {};

	var _init = function(settings) {
		var _settings = $.extend(true, {}, settings);

		var pieChartData = [
			{ label: "JS", value: 20, desc: "" },
			{ label: "CSS", value: 10, desc: "" },
			{ label: "HTML5 or Whatever", value: 52, desc: "" },
			{ label: "Sass", value: 80, desc: "" },
			{ label: "PHP", value: 26, desc: "" }
		];

		var totalSize = 0;
		for (var i=0; i<pieChartData.length; i++) {
			totalSize += pieChartData[i].value;
		}


		var arc = d3.svg.arc()
			.innerRadius(_settings.innerRadius)
			.outerRadius(_settings.outerRadius)
			.startAngle(0)
			.endAngle(function(d) {
				return (d.value / totalSize) * 2 * Math.PI;
			});

		var svg = d3.select("#demoPieChart").append("svg:svg")
			.attr("width", _settings.w)
			.attr("height", _settings.h)
			.append("svg:g")
			.attr("transform", "translate(" + (_settings.w/2) + "," + (_settings.h/2) + ")");

		var g = svg.selectAll(".arc")
			.data(
			pieChartData.filter(function(d) { return d.value; }),
			function(d) { return d.label; }
		)
			.enter()
			.append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("id", function(d, i) {
				return "segment" + i;
			})
			.style("fill", function(d, index) {
				return _settings.colors[index];
			})
			.transition()
			.ease("cubic-in-out")
			.duration(_settings.slideInSpeed)
			.attrTween("d", arcTween);

		svg.selectAll("g")
			.attr("transform",
			function(d, i) {
				var angle = getSegmentRotationAngle(d, i);
				return "rotate(" + angle + ")";
			}
		);

		var labelGroup = svg.selectAll(".arc")
			.append("g")
			.attr("class", "labelGroup")
			.attr("id", function(d, i) {
				return "labelGroup" + i
			});

		labelGroup.append("text")
			.attr("id", function(d, i) {
				return "label" + i
			})
			.text(function(d) {
				return d.label;
			})
			.attr("transform", function(d, i) {
				var angle = getSegmentRotationAngle(d, i);
				var labelRadius = _settings.outerRadius + 20;
				var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.style('opacity', 0)
			.style('font-weight', "bold");

		labelGroup.append("text")
			.text(function(d) {
				return Math.round((d.value / totalSize) * 100) + "%";
			})
			.attr("class", "pieShare")
			.attr("transform", function(d, i) {
				var angle = getSegmentRotationAngle(d, i);
				var labelRadius = _settings.outerRadius + 20;
				var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse

				return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ") rotate(" + -angle + ")";
			})
			.attr("dx", function(d, i) {
				var correspondingLabelWidth = document.getElementById("label" + i).getComputedTextLength();
				return correspondingLabelWidth + 3;
			})
			.style('opacity', 0);

		labelGroup
			.attr("dx", function(d, i) {
				return "-200px";
			});

		// fade in the labels when the load effect is complete
		setTimeout(function() {
			g.selectAll("text")
				.transition()
				.duration(_settings.labelFadeInTime)
				.style('opacity', 1);
		}, settings.slideInSpeed);

		function arcTween(b) {
			var i = d3.interpolate({ value: 0 }, b);
			return function(t) {
				return arc(i(t));
			};
		}

		function getSegmentRotationAngle(d, index) {
			var val = 0;
			for (var i=0; i<index; i++) {
				val += pieChartData[i].value;
			}
			return (val / totalSize) * 360;
		}

		/*
		 var gradient = svg.append("defs").append("radialGradient")
		 .attr("id", "gradient")
		 .attr("cx", function(d, index) {
		 //		var g = svg.selectAll("g");
		 //		console.log();
		 //		var center = arc.centroid(g[index]);
		 //		return center[0];
		 })
		 .attr("cy", "50%");

		 gradient.append("stop")
		 .attr("offset", "0%")
		 .attr("stop-color", function(d, i) {
		 return colors[i]
		 })
		 .attr("stop-opacity", 0.5);

		 gradient.append("stop")
		 .attr("offset", "100%")
		 .attr("stop-opacity", 1);
		 */

		$(function() {
			$(".arc").on("click", function(e) {
				var $segment = $(e.currentTarget).find("path");

				// detect if it's moving here

				if ($segment.attr("class") === "expanded") {
					closeSegment($segment[0]);
				} else {
					openSegment($segment[0]);
				}
			});
		})

		function openSegment(segment) {

			// close any open segments
			if ($(".expanded").length > 0) {
				closeSegment($(".expanded")[0]);
			}

			d3.select(segment).transition()
				.duration(400)
				.attr("transform", function(d, i) {
					var c = arc.centroid(d),
						x = c[0],
						y = c[1],
						h = Math.sqrt(x*x + y*y),
						pullOutSize = 8;

					return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
				})
				.each("end", function(d, i) {
					$(this).attr("class", "expanded");
				});
		}

		function closeSegment(segment) {
			d3.select(segment).transition()
				.duration(400)
				.attr("transform", "translate(0,0)")
				.each("end", function(d, i) {
					$(this).attr("class", "");
				});
		}
	};


	window.pieChart = function(params) {
		_init(params);
	};

})();