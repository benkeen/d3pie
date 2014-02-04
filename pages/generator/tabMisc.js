define([
	"constants",
	"mediator",
	"hbs!miscTabTemplate"
], function(C, mediator, miscTabTemplate) {
	"use strict";

	var _MODULE_ID = "miscTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};


	var _render = function(config) {
		$("#miscTab").html(miscTabTemplate({ config: config }));
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