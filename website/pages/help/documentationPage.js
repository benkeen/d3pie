define([
	"hbs!documentationPageTemplate"
], function(documentationPageTemplate) {
	"use strict";

	var _init = function() {
		$("#docs").html(documentationPageTemplate());
	};

	return {
		init: _init
	};
});