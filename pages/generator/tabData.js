define([
	"constants",
	"mediator",
	"hbs!dataTabTemplate"
], function(C, mediator, dataTabTemplate) {
	"use strict";

	var _MODULE_ID = "colorsTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#dataTab").html(dataTabTemplate({ config: config }));
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