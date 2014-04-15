define([
	"hbs!examplesPageTemplate"
], function(examplesPageTemplate) {
	"use strict";

	var _MODULE_ID = "examplesPage";

	var _init = function() {
		$("#examplesPage").html(examplesPageTemplate());
	};

	return {
		init: _init
	};
});