define([
	"hbs!examplesPageTemplate"
], function(examplesPageTemplate) {
	"use strict";

	var _MODULE_ID = "examples";

	var _init = function() {
		$("#examples").html(examplesPageTemplate());
	};

	return {
		init: _init
	};
});