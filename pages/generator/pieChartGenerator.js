/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"pieChartGenerator",
	"hbs!dataTab",
	"hbs!effectsTab",
	"hbs!labelsTab",
	"hbs!miscTab",
	"hbs!stylesTab",
	"hbs!titleTab"
], function(C, pieChartGenerator, dataTab, effectsTab, labelsTab, miscTab, stylesTab, titleTab) {
	"use strict";

	// stores the current configuration of the pie chart. It's updated onload, and whenever the user
	// chooses a different example, or changes an individual setting. It's what's used to pass to d3pie.js
	// to actually render the
	var _currentPieSettings = {};

	var _init = function() {

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_currentPieSettings = C.EXAMPLE_PIES[0].config;

		// render the generator tabs
		$("#dataTab").html(dataTab({ config: _currentPieSettings }));
		$("#effectsTab").html(effectsTab({ config: _currentPieSettings }));
		$("#labelsTab").html(labelsTab({ config: _currentPieSettings }));
		$("#miscTab").html(miscTab({ config: _currentPieSettings }));
		$("#stylesTab").html(stylesTab({ config: _currentPieSettings }));
		$("#titleTab").html(titleTab({ config: _currentPieSettings }));

		_addEventHandlers();

		// now render the pie!
		_renderWithAnimation()
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addEventHandlers = function() {

		// instantiated our individual colour pickers
		$("#titleColorGroup").colorpicker();
		$("#backgroundColorGroup").colorpicker();

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		//
		$("#pieTitle,#titleColor,#titleLocation,#titleFont").on("change", _renderWithNoAnimation);
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
			config.effects.load = "none";
		}

		// temporary
		config.width  = 500;
		config.height = 500;

		$("#generatorPieChart").d3pie(config);
	};

	/**
	 * Parses the generator fields and get the latest values.
	 * @private
	 */
	var _getConfigObject = function() {
		return {
			title:   _getTitleTabData(),
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
			enableTooltips: $("#enableTooltips")[0].checked
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