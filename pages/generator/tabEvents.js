define([
	"constants",
	"mediator",
	"hbs!eventsTabTemplate"
], function(C, mediator, eventsTabTemplate) {
	"use strict";

	var _MODULE_ID = "eventsTab";


	var _render = function(config) {
		$("#eventsTab").html(eventsTabTemplate({ config: config }));
	};

	var _getTabData = function() {
		return {

		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});