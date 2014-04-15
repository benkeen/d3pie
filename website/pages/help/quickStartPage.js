define([
	"hbs!quickStartPageTemplate"
], function(quickStartPageTemplate) {
	"use strict";

	var _MODULE_ID = "quickStartPage";

	var _init = function() {
		$("#howToUse").html(quickStartPageTemplate());
	};

	return {
		init: _init
	};
});