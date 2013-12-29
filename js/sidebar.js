// rename this to generatorView or something...
define([
	"constants",
	"pieChartGenerator",
	"hbs!sidebarTemplate"
], function(C, pieChartGenerator, sidebarTemplate) {
	"use strict";

	var _init = function() {

		// always initialize the sidebar with whatever's stored in the first example pie chart
		var pie = C.EXAMPLE_PIES[0];
		$("#sidebar").html(sidebarTemplate({
			config: pie.config
		}));

		_addEventHandlers();
	};

	/**
	 *
	 * @private
	 */
	var _addEventHandlers = function() {
		$("#titleColorGroup").colorpicker();
		$("#backgroundColorGroup").colorpicker();
	};

	var _loadExamplePie = function(config) {

	};

	return {
		init: _init
	}
});