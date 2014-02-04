define([
	"constants",
	"mediator",
	"hbs!labelsTabTemplate"
], function(C, mediator, labelsTabTemplate) {
	"use strict";

	var _MODULE_ID = "labelsTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#labelsTab").html(labelsTabTemplate({ config: config }));
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