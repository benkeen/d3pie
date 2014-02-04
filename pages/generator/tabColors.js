define([
	"constants",
	"mediator",
	"hbs!colorsTabTemplate"
], function(C, mediator, colorsTabTemplate) {
	"use strict";

	var _MODULE_ID = "colorsTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#colorsTab").html(colorsTabTemplate({ config: config }));
	};

	var _getTabData = function() {
		return {

		};
	};

	return {
		init: _init,
		render: _render,
		getTabData: _getTabData
	};
});