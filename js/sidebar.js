define([
	"constants",
	"hbs!sidebarTemplate"
], function(C, sidebarTemplate) {
	"use strict";

	var _init = function() {

		// always initialize the sidebar with whatever's stored in the first example pie chart
		var pie = C.EXAMPLE_PIES[0];
		$("#sidebar").html(sidebarTemplate({
			config: pie.config
		}));

		$("#titleColourGroup").colorpicker();
	};

	var _loadExamplePie = function(config) {

	};


	return {
		init: _init
	}
});