define([
	"constants",
	"hbs!primaryTabsTemplate",
	"hbs!examplePiesTemplate"
], function(C, primaryTabsTemplate, examplePiesTemplate) {
	"use strict";

	/**
	 * Our main initialization function. This creates the appropriate markup for the primary tabs and inserts
	 * it into the page.
	 * @private
	 */
	var _init = function() {
		var html = examplePiesTemplate({ examples: C.EXAMPLE_PIES });
		$("#primaryTabs").html(primaryTabsTemplate({
			examples: html
		}));

		_addEventHandlers();
	};

	var _addEventHandlers = function() {

	};

	return {
		init: _init
	};
})