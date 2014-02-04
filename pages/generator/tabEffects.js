define([
	"constants",
	"mediator",
	"hbs!effectsTabTemplate"
], function(C, mediator, effectsTabTemplate) {
	"use strict";

	var _MODULE_ID = "effectsTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#effectsTab").html(effectsTabTemplate({ config: config }));
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