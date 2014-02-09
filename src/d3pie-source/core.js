var _pluginName = "d3pie";

// to be populated when each item is first rendered on the canvas
var computedSizes = {
	title: { h: 0, w: 0 },
	subtitle: { h: 0, w: 0 },
	topHeaderGroup: { h: 0, w: 0 }
};

var _pieMetadata = {
	totalSize: 0,
	innerRadius: 0,
	outerRadius: 0,
	hasTitle: false,
	hasSubtitle: false,
	hasFooter: false
};

var _arc, _svg,  _options;
var _offscreenCoord = -10000;

// -------------------------------


// our constructor
function d3pie(element, options) {
	this.element = element;
	this.options = $.extend(true, {}, _defaultSettings, options);

	// confirm d3 is available [check minimum version]
	if (!window.d3 || !window.d3.hasOwnProperty("version")) {
		console.error("d3pie error: d3 is not available");
		return;
	}

	// validate here

	this._defaults = _defaultSettings;
	this._name = _pluginName;

	// now initialize the thing
	this.init();
}

// prevents multiple instantiations of the same plugin on the same element
$.fn[_pluginName] = function(options) {
	return this.each(function() {
		if (!$.data(this, _pluginName)) {
			$.data(this, _pluginName, new d3pie(this, options));
		}
	});
};


// ----- public functions -----

d3pie.prototype.destroy = function() {
	$(this.element).removeData(_pluginName); // remove the data attr
	$(this.element).html(""); // clear out the SVG
	//delete this.options;
};

d3pie.prototype.recreate = function() {
	$(this.element).html("");
	this.init();
};


// this let's the user dynamically update aspects of the pie chart without causing a complete redraw. It
// intelligently re-renders only the part of the pie that the user specifies. Some things cause a repaint, others
// just redraw the single element
d3pie.prototype.updateProp = function(propKey, value, optionalSettings) {
	switch (propKey) {
		case "header.title.text":
			var oldValue = d3pie.helpers.processObj(this.options, propKey);
			d3pie.helpers.processObj(this.options, propKey, value);
			$("#title").html(value);
			if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
				this.recreate();
			}
			break;

		case "header.subtitle.text":
			var oldValue = d3pie.helpers.processObj(this.options, propKey);
			d3pie.helpers.processObj(this.options, propKey, value);
			$("#subtitle").html(value);
			if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
				this.recreate();
			}
			break;

		case "callbacks.onload":
		case "callbacks.onMouseoverSegment":
		case "callbacks.onMouseoutSegment":
		case "callbacks.onClickSegment":
			d3pie.helpers.processObj(this.options, propKey, value);
			break;
	}
};


// ----- private functions -----


d3pie.prototype.init = function() {
	_options = this.options;

	// 1. Prep-work
	_options.data = d3pie.math.sortPieData(_options.data, _options.misc.dataSortOrder);
	_addSVGSpace(this.element);

	_pieMetadata.hasTitle    = _options.header.title.text !== "";
	_pieMetadata.hasSubtitle = _options.header.subtitle.text !== "";
	_pieMetadata.hasFooter   = _options.footer.text !== "";

	// 2. add all text components offscreen. We need to know their widths/heights for later computation
	_addTextElementsOffscreen();
	_addFooter(); // the footer never moves- just put it in place now.

	// 3. now we have all the data we need, compute the available space for the pie chart
	d3pie.math.computePieRadius();

	// position the title + subtitle. These two are interdependent
	_positionTitle();
	_positionSubtitle();

	// STEP 2: now create the pie chart and add the labels. We have to place this in a timeout because the previous
	// functions took a little time
	setTimeout(function() {
		_createPie();
		_addFilter();
		_addLabels();
		_addSegmentEventHandlers();
	}, 5);
};


var _addTextElementsOffscreen = function() {
	if (_pieMetadata.hasTitle) {
		_addTitle();
	}
	if (_pieMetadata.hasSubtitle) {
		_addSubtitle();
	}
};


// creates the SVG element
var _addSVGSpace = function(element) {
	_svg = d3.select(element).append("svg:svg")
		.attr("width", _options.size.canvasWidth)
		.attr("height", _options.size.canvasHeight);

	if (_options.styles.backgroundColor !== "transparent") {
		_svg.style("background-color", function() { return _options.styles.backgroundColor; });
	}
};

/**
 * Adds the Pie Chart title.
 * @param titleData
 * @private
 */
var _addTitle = function() {
	var title = _svg.selectAll(".title").data([_options.header.title]);
	title.enter()
		.append("text")
		.attr("id", "title")
		.attr("x", _offscreenCoord)
		.attr("y", _offscreenCoord)
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
};


var _positionTitle = function() {
	_componentDimensions.title.h = _getTitleHeight();
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
};

var _positionSubtitle = function() {
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
};

var _addSubtitle = function() {
	if (_options.header.subtitle.text === "") {
		return;
	}

	_svg.selectAll(".subtitle")
		.data([_options.header.subtitle])
		.enter()
		.append("text")
		.attr("x", _offscreenCoord)
		.attr("y", _offscreenCoord)
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
};

var _addFooter = function() {
	_svg.selectAll(".footer")
		.data([_options.footer])
		.enter()
		.append("text")
		.attr("x", _offscreenCoord)
		.attr("y", _offscreenCoord)
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

	_whenIdExists("footer", _positionFooter);
};

var _positionFooter = function() {
	var x;
	if (_options.footer.location === "bottom-left") {
		x = _options.misc.canvasPadding.left;
	} else if (_options.footer.location === "bottom-right") {
		var dims = document.getElementById("footer").getBBox();
		x = _options.size.canvasWidth - dims.width - _options.misc.canvasPadding.right;
	} else {
		x = _options.size.canvasWidth / 2;
	}

	_svg.select("#footer")
		.attr("x", x)
		.attr("y", _options.size.canvasHeight - _options.misc.canvasPadding.bottom);
};


var _openSegment = function(segment) {

	// close any open segments
	if ($(".expanded").length > 0) {
		_closeSegment($(".expanded")[0]);
	}

	d3.select(segment).transition()
		.ease(_options.effects.pullOutSegmentOnClick.effect)
		.duration(_options.effects.pullOutSegmentOnClick.speed)
		.attr("transform", function(d, i) {
			var c = _arc.centroid(d),
				x = c[0],
				y = c[1],
				h = Math.sqrt(x*x + y*y),
				pullOutSize = 8;

			return "translate(" + ((x/h) * pullOutSize) + ',' + ((y/h) * pullOutSize) + ")";
		})
		.each("end", function(d, i) {
			$(this).attr("class", "expanded");
		});
};

var _closeSegment = function(segment) {
	d3.select(segment).transition()
		.duration(400)
		.attr("transform", "translate(0,0)")
		.each("end", function(d, i) {
			$(this).attr("class", "");
		});
};


/**
 * Creates the pie chart segments and displays them according to the selected load effect.
 * @param element
 * @param options
 * @private
 */
var _createPie = function() {
	_totalSize = d3pie.math.getTotalPieSize(_options.data);

	var pieChartElement = _svg.append("g")
		.attr("transform", _getPieTranslateCenter)
		.attr("class", "pieChart");

	_arc = d3.svg.arc()
		.innerRadius(_innerRadius)
		.outerRadius(_outerRadius)
		.startAngle(0)
		.endAngle(function(d) {
			var angle = (d.value / _totalSize) * 2 * Math.PI;
			return angle;
		});

	var g = pieChartElement.selectAll(".arc")
		.data(
		_options.data.filter(function(d) { return d.value; }),
		function(d) { return d.label; }
	)
		.enter()
		.append("g")
		.attr("class", function() {
			var className = "arc";
			if (_options.effects.highlightSegmentOnMouseover) {
				className += " arcHover";
			}
			return className;
		});

	// if we're not fading in the pie, just set the load speed to 0
	var loadSpeed = _options.effects.load.speed;
	if (_options.effects.load.effect === "none") {
		loadSpeed = 0;
	}

	g.append("path")
		.attr("id", function(d, i) { return "segment" + i; })
		.style("fill", function(d, index) { return _options.styles.colors[index]; })
		.style("stroke", "#ffffff")
		.style("stroke-width", 1)
		.transition()
		.ease("cubic-in-out")
		.duration(loadSpeed)
		.attr("data-index", function(d, i) { return i; })
		.attrTween("d", _arcTween);

	_svg.selectAll("g.arc")
		.attr("transform",
		function(d, i) {
			var angle = _getSegmentRotationAngle(i, _options.data, _totalSize);
			return "rotate(" + angle + ")";
		}
	);
};


var _addSegmentEventHandlers = function() {
	$(".arc").on("click", function(e) {
		var $segment = $(e.currentTarget).find("path");
		var isExpanded = $segment.attr("class") === "expanded";

		_onSegmentEvent(_options.callbacks.onClickSegment, $segment, isExpanded);

		if (_options.effects.pullOutSegmentOnClick.effect !== "none") {
			if (isExpanded) {
				_closeSegment($segment[0]);
			} else {
				_openSegment($segment[0]);
			}
		}
	});

	$(".arc").on("mouseover", function(e) {
		var $segment = $(e.currentTarget).find("path");
		var isExpanded = $segment.attr("class") === "expanded";
		_onSegmentEvent(_options.callbacks.onMouseoverSegment, $segment, isExpanded);
	});

	$(".arc").on("mouseout", function(e) {
		var $segment = $(e.currentTarget).find("path");
		var isExpanded = $segment.attr("class") === "expanded";
		_onSegmentEvent(_options.callbacks.onMouseoutSegment, $segment, isExpanded);
	});
};

// helper function used to call the click, mouseover, mouseout segment callback functions
var _onSegmentEvent = function(func, $segment, isExpanded) {
	if (!$.isFunction(func)) {
		return;
	}
	try {
		var index = parseInt($segment.data("index"), 10);
		func({
			segment: $segment[0],
			index: index,
			expanded: isExpanded,
			data: _options.data[index]
		});
	} catch(e) { }
};


var _addFilter = function() {
	//console.log(_getPieCenter());
	//_svg.append('<filter id="testBlur"><feDiffuseLighting in="SourceGraphic" result="light" lighting-color="white"><fePointLight x="150" y="60" z="20" /></feDiffuseLighting><feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/></filter>')
};

