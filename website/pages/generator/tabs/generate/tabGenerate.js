define([
	"constants",
	"mediator",
	"pageHelper",
	"hbs!generateTabTemplate"
], function(C, mediator, pageHelper, generateTabTemplate) {
	"use strict";

	var _MODULE_ID = "generateTab";


	var _render = function(tabEl, config) {
		$(tabEl).html(generateTabTemplate());
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render
	};
});