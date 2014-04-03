/*!
 * d3pie
 * @author Ben Keen
 * @version 0.1.0
 * @date Apr 2014
 * http://github.com/benkeen/d3pie
 */
;(function($) {
	"use strict";

	var _scriptName = "d3pie";
	var _version = "0.1.0";

	// used to uniquely generate IDs and classes, ensuring no conflict between multiple pies on the same page
	var _uniqueIDCounter = 0;


	// this section includes all helper libs on the d3pie object. They're populated via grunt-template. Note: to keep
	// the syntax highlighting from getting all messed up, I commented out each line. That REQUIRES each of the files
	// to have an empty first line. Crumby, yes, but acceptable.
	//<%=_defaultSettings%>
	//<%=_validate%>
	//<%=_helpers%>
	//<%=_math%>
	//<%=_labels%>
	//<%=_segments%>
	//<%=_text%>

	// --------------------------------------------------------------------------------------------

	// our constructor
	var d3pie = function(element, options) {

		// element can be an ID or DOM element
		this.element = (typeof element === "string") ? $("#" + element)[0] : element;
		this.options = $.extend(true, {}, defaultSettings, options);

		// if the user specified a custom CSS element prefix (ID, class), use it. Otherwise use the
		if (this.options.misc.cssPrefix !== null) {
			this.cssPrefix = this.options.misc.cssPrefix;
		} else {
			this.cssPrefix = "p" + _uniqueIDCounter + "_";
			_uniqueIDCounter++;
		}

		// now run some validation on the user-defined info
		if (!validate.initialCheck(this)) {
			return;
		}

		// add a data-role to the DOM node to let anyone know that it contains a d3pie instance, and the d3pie version
		$(this.element).data(_scriptName, _version);

		_init.call(this);
	};

	d3pie.prototype.recreate = function() {
		this.element.innerHTML = "";
		_init();
	};

	d3pie.prototype.destroy = function() {
		$(this.element).removeData(_scriptName); // remove the data attr
		this.element.innerHTML = ""; // clear out the SVG
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
	d3pie.prototype.getOpenPieSegment = function() {
		var segment = segments.currentlyOpenSegment;
		if (segment !== null) {
			var index = parseInt($(segment).data("index"), 10);
			return {
				element: segment,
				index: index,
				data: this.options.data[index]
			}
		} else {
			return null;
		}
	};

	d3pie.prototype.openSegment = function(index) {
		var index = parseInt(index, 10);
		if (index < 0 || index > this.options.data.length-1) {
			return;
		}
		segments.openSegment($("#segment" + index)[0]);
	};

	// this let's the user dynamically update aspects of the pie chart without causing a complete redraw. It
	// intelligently re-renders only the part of the pie that the user specifies. Some things cause a repaint, others
	// just redraw the single element
	d3pie.prototype.updateProp = function(propKey, value, optionalSettings) {
		switch (propKey) {
			case "header.title.text":
				var oldVal = helpers.processObj(this.options, propKey);
				helpers.processObj(this.options, propKey, value);
				$("#" + this.cssPrefix + "title").html(value);
				if ((oldVal === "" && value !== "") || (oldVal !== "" && value === "")) {
					this.recreate();
				}
				break;

			case "header.subtitle.text":
				var oldValue = helpers.processObj(this.options, propKey);
				helpers.processObj(this.options, propKey, value);
				$("#" + this.cssPrefix + "subtitle").html(value);
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
				helpers.processObj(this.options, propKey, value);
				break;

		}
	};


	// ------------------------------------------------------------------------------------------------


	var _init = function() {

		// 1. prep-work
		this.options.data   = math.sortPieData(this);
		this.options.colors = helpers.initSegmentColors(this);
		this.totalSize      = math.getTotalPieSize(this.options.data);
		this.svg = helpers.addSVGSpace(this);

		// 2. store info about the main text components as part of the d3pie object instance. This is populated
		this.textComponents = {
			title: {
				exists: this.options.header.title.text !== "",
				h: 0,
				w: 0
			},
			subtitle: {
				exists: this.options.header.subtitle.text !== "",
				h: 0,
				w: 0
			},
			footer: {
				exists: this.options.footer.text !== "",
				h: 0,
				w: 0
			}
		};

		// 3. add the key text components offscreen (title, subtitle, footer). We need to know their widths/heights for later computation
		if (this.textComponents.title.exists) {
			text.addTitle(this);
		}
		if (this.textComponents.subtitle.exists) {
			text.addSubtitle(this);
		}
		text.addFooter(this);

		// the footer never moves - this puts it in place now
		var self = this;
		helpers.whenIdExists(this.cssPrefix + "footer", function() {
			text.positionFooter(self);
			var d3 = helpers.getDimensions(self.cssPrefix + "footer");
			self.textComponents.footer.h = d3.h;
			self.textComponents.footer.w = d3.w;
		});

		math.computePieRadius(this);

		// this value is used all over the place for placing things and calculating locations. We figure it out ONCE
		// and store it as part of the object
		math.calculatePieCenter(this);


		// STEP 2: now create the pie chart and position everything accordingly
		var reqEls = [];
		if (this.textComponents.title.exists)    { reqEls.push(this.cssPrefix + "title"); }
		if (this.textComponents.subtitle.exists) { reqEls.push(this.cssPrefix + "subtitle"); }
		if (this.textComponents.footer.exists)   { reqEls.push(this.cssPrefix + "footer"); }

		helpers.whenElementsExist(reqEls, function() {
			if (self.textComponents.title.exists) {
				var d1 = helpers.getDimensions(self.cssPrefix + "title");
				self.textComponents.title.h = d1.h;
				self.textComponents.title.w = d1.w;
			}
			if (self.textComponents.subtitle.exists) {
				var d2 = helpers.getDimensions(self.cssPrefix + "subtitle");
				self.textComponents.subtitle.h = d2.h;
				self.textComponents.subtitle.w = d2.w;
			}

			// position the title and subtitle
			text.positionTitle(self);
			text.positionSubtitle(self);

			// now create the pie chart segments
			segments.create(self); // also creates this.arc
			labels.add(self, "inner", self.options.labels.inner.format);
			labels.add(self, "outer", self.options.labels.outer.format);

			// position the label elements relatively within their individual group (label, percentage, value)
			labels.positionLabelElements(self, "inner", self.options.labels.inner.format);
			labels.positionLabelElements(self, "outer", self.options.labels.outer.format);
			labels.computeOuterLabelCoords(self);

			// this is (and should be) dumb. It just places the outer groups at their pre-calculated, collision-free positions
			labels.positionLabelGroups(self, "outer");

			// we use the label line positions for many other calculations, so ALWAYS compute them
			labels.computeLabelLinePositions(self);

			// only add them if they're actually enabled
			if (self.options.labels.lines.enabled && self.options.labels.outer.format !== "none") {
				labels.addLabelLines(self);
			}

			labels.positionLabelGroups(self, "inner");
			labels.fadeInLabelsAndLines(self);

			segments.addSegmentEventHandlers(self);
		});
	};

	// expose our d3pie function
	window.d3pie = d3pie;

})(jQuery);