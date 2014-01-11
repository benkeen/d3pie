/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"pieChartGenerator",
	"hbs!titleTab",
	"hbs!sizeTab",
	"hbs!dataTab",
	"hbs!labelsTab",
	"hbs!stylesTab",
	"hbs!effectsTab",
	"hbs!miscTab"
], function(C, pieChartGenerator, titleTab, sizeTab, dataTab, labelsTab, stylesTab, effectsTab, miscTab) {
	"use strict";

	// stores the current configuration of the pie chart. It's updated onload, and whenever the user
	// chooses a different example, or changes an individual setting. It's what's used to pass to d3pie.js
	// to actually render the
	var _currentPieSettings = {};
	var _isCreated = false;

	// used for tracking the state of each field and knowing when to trigger a repaint of the pie chart
	var _previousTitle = null;
	var _previousTitleColor = null;
	var _titleColorManuallyChanged = null;

	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_currentPieSettings = C.EXAMPLE_PIES[0].config;

		// render the generator tabs
		$("#titleTab").html(titleTab({ config: _currentPieSettings }));
		$("#sizeTab").html(sizeTab({ config: _currentPieSettings }));
		$("#dataTab").html(dataTab({ config: _currentPieSettings }));
		$("#effectsTab").html(effectsTab({ config: _currentPieSettings }));
		$("#labelsTab").html(labelsTab({ config: _currentPieSettings }));
		$("#miscTab").html(miscTab({ config: _currentPieSettings }));
		$("#stylesTab").html(stylesTab({ config: _currentPieSettings }));


		// log the state of various fields
		_previousTitle = _currentPieSettings.title.text;
		_previousTitleColor = _currentPieSettings.title.color;

		_addEventHandlers();

		// render the pie!
		_renderWithAnimation()
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addEventHandlers = function() {

		// instantiated our individual colour pickers
		$("#titleColorGroup").colorpicker().on("changeColor", _onTitleColorChangeViaColorpicker);
		$("#backgroundColorGroup").colorpicker();

		// title
		$("#pieTitle").on("keyup", function() {
			if (_previousTitle !== this.value) {
				_renderWithNoAnimation();
				_previousTitle = this.value;
			}
		});

		// size tab
		$("#pieInnerRadius").on("change", _onChangeInnerRadius);
		$("#pieOuterRadius").on("change", _onChangeOuterRadius);
		$("#pieOuterRadius").on("change", _renderWithNoAnimation);

		// label tab
		$("#labelColorGroup").colorpicker();
		$("#labelPercentageColorGroup").colorpicker();
		$("#labelSegmentValueColor").colorpicker();


		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		// bit confusing, but necessary. The color can be changed via two methods: by editing the input field
		// or by selecting a color via the colorpicker. The former still triggers a "changed" event on the colorpicker
		// so we need to tell it that the user just did it manually. That prevents unnecessary re-draws.
		$("#titleColor").on("input", function() {
			var newValue = this.value;
			_titleColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				_renderWithNoAnimation();
				_previousTitleColor = newValue;
			}
		});
	};

	var _onTitleColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousTitleColor !== newValue && newValue.length === 7 && !_titleColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousTitleColor = newValue;
		}
		_titleColorManuallyChanged = false;
	};

	var _onChangeInnerRadius = function(e) {
		$("#pieInnerRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
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

		// temporary
		config.width  = 500;
		config.height = 500;

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
			title:   _getTitleTabData(),
			size:    _getSizeData(),
			data:    _getDataTabData(),
			labels:  _getLabelsTabData(),
			styles:  _getStylesTabData(),
			effects: _getEffectsTabData(),
			misc:    _getMiscTabData()
		};
	};

	var _getTitleTabData = function() {
		return {
			text:     $("#pieTitle").val(),
			location: $("#titleLocation").val(),
			color:    $("#titleColor").val(),
			fontSize: $("#titleFontSize").val() + $("#titleFontSizeUnits").val(),
			font:     $("#titleFont").val()
		};
	};

	var _getSizeData = function() {
		return {
			canvasWidth:    $("#canvasWidth").val(),
			canvasHeight:   $("#canvasHeight").val(),
			pieInnerRadius: $("#pieInnerRadius").val(),
			pieOuterRadius: $("#pieOuterRadius").val()
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
			enableTooltips: $("#enableTooltips")[0].checked,
			labelColor: $("#labelColor").val(),
			labelPercentageColor: $("#labelPercentageColor").val(),
			labelSegmentValueColor: $("#labelSegmentValueColor").val()
		};
	};

	var _getStylesTabData = function() {
		return {
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			backgroundColor: null,
			colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"]
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
		return {

		};
	};

	return {
		init: _init
	}
});