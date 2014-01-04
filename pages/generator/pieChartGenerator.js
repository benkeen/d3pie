/**
 * Contains all the logic for the actual generator. It
 */
define([
	"constants",
	"pieChartGenerator",
	"hbs!sidebarTemplate"
], function(C, pieChartGenerator, sidebarTemplate) {
	"use strict";

	// stores the current configuration of the pie chart. It's updated onload, and whenever the user
	// chooses a different example, or changes an individual setting. It's what's used to pass to d3pie.js
	// to actually render the
	var _currentPieSettings = {};

	var _init = function() {

		// always initialize the sidebar with whatever's stored in the first example pie chart
		_currentPieSettings = C.EXAMPLE_PIES[0].config;
		$("#sidebar").html(sidebarTemplate({
			config: _currentPieSettings
		}));

		_addEventHandlers();

		// now render the pie!
		_renderPie(true, _currentPieSettings);
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

		//
	};

	var _renderPie = function(includeStartAnimation, config) {

		// if we don't want to include the start animation, just override the values in the UI. This is useful for
		// automatically showing the user's latest changes to the pie settings and not having to see the animation
		// each and every time
		if (!includeStartAnimation) {

		}

		$("#generatorPieChart").d3pie(config);
	};

	/**
	 * Parses the generator fields and get the latest values.
	 * @private
	 */
	var _getData = function() {
		return {
			title: _getTitleData()
		};
	};

	var _getTitleData = function() {
		return {
			text: $("#pieTitle").val(),
			location: $("#titleLocation").val(),
			color: $("#titleColor").val(),
			fontSize: $("#fontSize").val() + $("#fontSizeUnits").val(),
			font: ""
		};
	};

	return {
		init: _init
	}
});