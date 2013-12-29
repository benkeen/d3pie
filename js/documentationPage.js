define([
	"hbs!documentationPageTemplate"
], function(documentationPageTemplate) {
	"use strict";

	var _init = function() {
		$("#documentationPage").html(documentationPageTemplate());
	};

	return {
		init: _init
	};
});