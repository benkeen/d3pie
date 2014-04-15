define([
	"hbs!helpPageTemplate"
], function(helpPageTemplate) {
	"use strict";

	var _MODULE_ID = "helpPage";

	var _init = function() {
		$("#help").html(helpPageTemplate());
	};

	return {
		init: _init
	};
});