/**
 * --------- core.js -----------
 */

var _element; // the DOM element
var _totalSize = null;
var _arc;
var _svg;
var _options;
var _innerRadius;
var _outerRadius;


// this is our only publicly exposed function on the window object
var d3pie = function(element, options) {
	validate.initialCheck(element, options);

	// element can be an ID or DOM element
	_element = document.getElementById(element);
	_options = $.extend(true, {}, _defaultSettings, options);

	// now initialize the thing
	_init();

	//data-d3pie="1" // urgh.. or something

	// return our public API
	return {
		recreate: _recreate,
		updateProp: _updateProp,
		destroy: _destroy,
		getOpenPieSegment: _getOpenPieSegment,
		openSegment: _openSegment
	};
};


var _recreate = function() {
	_element.innerHTML = "";
	_init();
};

var _destroy = function() {
//	$(_element).removeData(_pluginName); // remove the data attr
	_element.innerHTML = ""; // clear out the SVG
};


/**
 * Returns all pertinent info about the current open info. Returns null if nothing's open, or if one is, an object of
 * the following form:
 * 	{
 * 	  element: DOM NODE,
 * 	  index: N,
 * 	  data: {}
 * 	}
 */
var _getOpenPieSegment = function() {
	var segment = segments.currentlyOpenSegment;
	if (segment !== null) {
		var index = parseInt($(segment).data("index"), 10);
		return {
			element: segment,
			index: index,
			data: _options.data[index]
		}
	} else {
		return null;
	}
};


var _openSegment = function(index) {
	var index = parseInt(index, 10);
	if (index < 0 || index > _options.data.length-1) {
		return;
	}
	segments.openSegment($("#segment" + index)[0]);
};


// this let's the user dynamically update aspects of the pie chart without causing a complete redraw. It
// intelligently re-renders only the part of the pie that the user specifies. Some things cause a repaint, others
// just redraw the single element
var _updateProp = function(propKey, value, optionalSettings) {
	switch (propKey) {
		case "header.title.text":
			var oldValue = helpers.processObj(_options, propKey);
			helpers.processObj(_options, propKey, value);
			$("#title").html(value);
			if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
				this.recreate();
			}
			break;

		case "header.subtitle.text":
			var oldValue = helpers.processObj(_options, propKey);
			helpers.processObj(_options, propKey, value);
			$("#subtitle").html(value);
			if ((oldValue === "" && value !== "") || (oldValue !== "" && value === "")) {
				this.recreate();
			}
			break;

		case "callbacks.onload":
		case "callbacks.onMouseoverSegment":
		case "callbacks.onMouseoutSegment":
		case "callbacks.onClickSegment":
		case "effects.pullOutSegmentOnClick.effect":
		case "effects.pullOutSegmentOnClick.speed":
		case "effects.pullOutSegmentOnClick.size":
		case "effects.highlightSegmentOnMouseover":
		case "effects.highlightLuminosity":
			helpers.processObj(_options, propKey, value);
			break;

	}
};


var _init = function() {

	// 1. Prep-work
	_options.data   = math.sortPieData(_options.data.content, _options.data.sortOrder);
	_options.colors = helpers.initSegmentColors(_options.data, _options.misc.colors.segments);
	_totalSize      = math.getTotalPieSize(_options.data);

	helpers.addSVGSpace(_element, _options.size.canvasWidth, _options.size.canvasHeight, _options.misc.colors.background);

	// 2. add the key text components offscreen (title, subtitle, footer). We need to know their widths/heights for later computation
	text.trackComponents();
	text.addTextElementsOffscreen();
	text.addFooter(); // the footer never moves - just put it in place now

	var radii = math.computePieRadius();
	_innerRadius = radii.inner;
	_outerRadius = radii.outer;

	// STEP 2: now create the pie chart and position everything accordingly
	var requiredElements = [];
	if (text.components.title.exists)    { requiredElements.push("title"); }
	if (text.components.subtitle.exists) { requiredElements.push("subtitle"); }
	if (text.components.footer.exists)   { requiredElements.push("footer"); }

	helpers.whenElementsExist(requiredElements, function() {
		text.storeComponentDimensions();
		text.positionTitle();
		text.positionSubtitle();

		segments.create();
		var l = labels;
		l.add("inner", _options.labels.inner.format);
		l.add("outer", _options.labels.outer.format);

		// position the label elements relatively within their individual group (label, percentage, value)
		l.positionLabelElements("inner", _options.labels.inner.format);
		l.positionLabelElements("outer", _options.labels.outer.format);
		l.computeOuterLabelCoords();

		// this is (and should be) dumb. It just places the outer groups at their pre-calculated, collision-free positions
		l.positionLabelGroups("outer");

		// we use the label line positions for other calculations, so ALWAYS compute them (boooo)
		l.computeLabelLinePositions();

		// only add them if they're actually enabled
		if (_options.labels.lines.enabled && _options.labels.outer.format !== "none") {
			l.addLabelLines();
		}

		l.positionLabelGroups("inner");
		l.fadeInLabelsAndLines();

		segments.addSegmentEventHandlers();
	});
};


window.d3pie = d3pie;
