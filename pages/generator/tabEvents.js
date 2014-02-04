define([
	"constants",
	"mediator",
	"hbs!eventsTabTemplate"
], function(C, mediator, eventsTabTemplate) {
	"use strict";

	var _MODULE_ID = "eventsTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#eventsTab").html(eventsTabTemplate({ config: config }));
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