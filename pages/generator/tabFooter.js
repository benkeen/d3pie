define([
	"constants",
	"mediator",
	"hbs!footerTabTemplate"
], function(C, mediator, footerTabTemplate) {
	"use strict";

	var _MODULE_ID = "footerTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#footerTab").html(footerTabTemplate({ config: config }));
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