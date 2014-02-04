/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"mediator",
	"titleTab",
	"hbs!examplePiesTemplate",
	"hbs!generatorPageTemplate",
	"hbs!sizeTab",
	"hbs!dataTab",
	"hbs!labelsTab",
	"hbs!colorTab",
	"hbs!effectsTab",
	"hbs!eventsTab",
	"hbs!footerTab",
	"hbs!miscTab"
], function(C, mediator, titleTab, examplePiesTemplate, generatorPageTemplate, sizeTab, dataTab, labelsTab, colorTab,
			effectsTab, eventsTab, footerTab, miscTab) {
	"use strict";

	var _MODULE_ID = "generatorPage";
	var _isCreated = false;

	// used for tracking the state of each field and knowing when to trigger a repaint of the pie chart
	var _previousFooterText = null;

	var _previousFooterColor = null;
	var _previousBackgroundColor = null;

	var _footerColorManuallyChanged = null;
	var _backgroundColorManuallyChanged = null;


	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {

		// register the current module
		mediator.register(_MODULE_ID);

		titleTab.init();


		$("#generatorPage").html(generatorPageTemplate({
			examples: examplePiesTemplate({ examples: C.EXAMPLE_PIES })
		}));

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_loadDemoPie(C.EXAMPLE_PIES[0]);

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent,#footerRow").hide().removeClass("hidden").fadeIn(400);

		$("#exampleDropdown").on("click", "ul li a", function(e) {
			var index = parseInt($(e.target).data("index"), 10);
			_loadDemoPie(C.EXAMPLE_PIES[index]);
		});

		$("#deleteColorZone").sortable({
			connectWith: "#segmentColors",
			over: function() {
				console.log("....");
			}
		});

		$("#addColorLink").on("click", function(e) {
			e.preventDefault();
		});

		// focus on the title field, just to be nice
		$("#pieTitle").focus();

		var subscriptions = {};
		subscriptions[C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION] = _renderWithNoAnimation;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION] = _renderWithAnimation;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addTabEventHandlers = function() {

		// general event handlers used in any old tab
		$(".changeUpdateNoAnimation").on("change", _renderWithNoAnimation);
		$(".updateNoAnimation").on("keyup change", _onKeyupNumberFieldUpdateNoAnimation);

		// 2. size tab
		$("#showCanvasOutline").on("click", function(e) {
			if (e.target.checked) {
				$("#generatorPieChart").addClass("showOutline");
			} else {
				$("#generatorPieChart").removeClass("showOutline");
			}
		});
		$("#pieInnerRadius").on("change", _onChangeInnerRadius);
		$("#pieOuterRadius").on("change", _onChangeOuterRadius);

		// 4. labels tab
		$("#labelColorGroup").colorpicker();
		$("#labelPercentageColorGroup").colorpicker();
		$("#labelSegmentValueColor").colorpicker();

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		// 5. Color tab
		$("#backgroundColorGroup").colorpicker().on("changeColor", _onBackgroundColorChangeViaColorPicker);
		$("#segmentColors").sortable({
			handle: ".handle",
			connectWith: "#deleteColorZone",
			update: _renderWithNoAnimation
		});

		// 6. Effects tab
		$("#loadEffect").on("change", _renderWithAnimation);

		// Footer tab
		$("#footerText").on("keyup", function() {
			if (_previousFooterText !== this.value) {
				_renderWithNoAnimation();
				_previousFooterText = this.value;
			}
		});

		$("#footerColor").on("input", function() {
			var newValue = this.value;
			_footerColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				_renderWithNoAnimation();
				_previousTitleColor = newValue;
			}
		});
		$("#footerColorGroup").colorpicker().on("changeColor", _onFooterColorChangeViaColorpicker);
	};

	var _onFooterColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousFooterColor !== newValue && newValue.length === 7 && !_footerColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousFooterColor = newValue;
		}
		_footerColorManuallyChanged = false;
	};

	var _onBackgroundColorChangeViaColorPicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousBackgroundColor !== newValue && newValue.length === 7 && !_backgroundColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousBackgroundColor = newValue;
		}
		_backgroundColorManuallyChanged = false;
	};

	var _onChangeInnerRadius = function(e) {
		$("#pieInnerRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onKeyupNumberFieldUpdateNoAnimation = function(e) {
		var val = e.target.value;

		// check it's not empty and contains only numbers
		if (/[^\d]/.test(val) || val === "") {
			$(e.target).addClass("hasError");
			return;
		}

		$(e.target).removeClass("hasError");
		_renderWithNoAnimation();
	};

	var _renderWithNoAnimation = function() {
		_renderPie(false, _getConfigObject());
	};

	var _renderWithAnimation = function() {
		_renderPie(true, _getConfigObject());
	};

	var _renderPie = function(includeStartAnimation, config) {

		// if we don't want to include the start animation, just override the values in the UI. This is useful for
		// automatically showing the user's latest changes to the pie settings and not having to see the animation
		// each and every time
		if (!includeStartAnimation) {
			config.effects.loadEffect = "none";
		}

		if (_isCreated) {
			$("#generatorPieChart").data("d3pie").destroy();
		}

		$("#generatorPieChart").d3pie(config);
		_isCreated = true;
	};


	/**
	 * Parses the generator fields and get the latest values.
	 * @private
	 */
	var _getConfigObject = function() {
		return {
			header:  titleTab.getTabData(),
			footer:  _getFooterTabData(),
			size:    _getSizeData(),
			data:    _getDataTabData(),
			labels:  _getLabelsTabData(),
			styles:  _getStylesTabData(),
			effects: _getEffectsTabData(),
			misc:    _getMiscTabData()
		};
	};


	var _getSizeData = function() {
		return {
			canvasWidth:    $("#canvasWidth").val(),
			canvasHeight:   $("#canvasHeight").val(),
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			pieOuterRadius: $("#pieOuterRadius").val() + "%"
		};
	};

	var _getDataTabData = function() {
		var data = [];
		var trs = $("#data-table tbody tr");
		for (var i=0; i<trs.length; i++) {
			data.push({
				label:   $(trs[i]).find(".dataLabel").val(),
				value:   parseInt($(trs[i]).find(".dataValue").val(), 10), // TODO - need validation
				tooltip: $(trs[i]).find(".dataTooltip").val()
			})
		}
		return data;
	};

	var _getLabelsTabData = function() {
		return {
			location: $("#labelLocation").val(),
			format:   $("#labelFormat").val(),
//			enableTooltips: $("#enableTooltips")[0].checked,
			labelColor: $("#labelColor").val(),
			labelPercentageColor: $("#labelPercentageColor").val(),
			labelSegmentValueColor: $("#labelSegmentValueColor").val()
		};
	};

	var _getFooterTabData = function() {
		return {
			text:     $("#footerText").val(),
			color:    $("#footerColor").val(),
			fontSize: $("#footerFontSize").val(),
			font:     $("#footerFont").val(),
			location: $("#footerLocation").val()
		};
	};

	var _getStylesTabData = function() {
		var colors = [];

		var colorElements = $("#segmentColors").find("span.color");
		for (var i=0; i<colorElements.length; i++) {
			colors.push(_rgb2hex($(colorElements[i]).css("background-color")));
		}
		return {
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			backgroundColor: null,
			colors: colors
		};
	};

	var _getEffectsTabData = function() {
		return {
			loadEffect: $("#loadEffect").val(),
			loadEffectSpeed: $("#loadEffectSpeed").val(),
			highlightSegmentOnMouseover: $("#highlightSegmentOnMouseover")[0].checked,
			pullOutSegmentOnClick: $("#pullOutSegmentOnClick")[0].checked,
			labelFadeInTime: 400
		};
	};

	var _getMiscTabData = function() {

		// TODO validation

		return {
			dataSortOrder: $("#dataSortOrder").val(),
			canvasPadding: {
				top: parseInt($("#canvasPaddingTop").val(), 10),
				right: parseInt($("#canvasPaddingRight").val(), 10),
				bottom: parseInt($("#canvasPaddingBottom").val(), 10),
				left: parseInt($("#canvasPaddingLeft").val(), 10)
			}
		};
	};

	var _loadDemoPie = function(pieConfiguration) {
		var config = pieConfiguration.config;

		// render the generator tabs
		titleTab.render(config);

		$("#sizeTab").html(sizeTab({ config: config }));
		$("#dataTab").html(dataTab({ config: config }));
		$("#labelsTab").html(labelsTab({ config: config }));
		$("#footerTab").html(footerTab({ config: config }));
		$("#colorTab").html(colorTab({ config: config }));
		$("#effectsTab").html(effectsTab({ config: config }));
		$("#eventsTab").html(eventsTab({ config: config }));
		$("#miscTab").html(miscTab({ config: config }));

		// log the state of various fields

		_previousFooterText = config.footer.text;

		// render the pie!
		_renderWithAnimation();

		// always add the event handlers. This is because the tabs are recreated every time this function is
		// called
		_addTabEventHandlers();
	};


	var _rgb2hex = function(rgb) {
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		if (  rgb.search("rgb") == -1 ) {
			return rgb;
		} else {
			rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
	}

	return {
		init: _init
	}
});