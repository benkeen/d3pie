define([
	"hbs!howToUsePageTemplate"
], function(howToUsePageTemplate) {
	"use strict";

	var _MODULE_ID = "howToUsePage";

	var _init = function() {
		$("#howToUse").html(howToUsePageTemplate());

	};

	return {
		init: _init
	};
});