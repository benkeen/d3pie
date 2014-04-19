define([
	"hbs!quickStartPageTemplate"
], function(quickStartPageTemplate) {
	"use strict";

	var _init = function() {
		$("#quickStart").html(quickStartPageTemplate());
	};

	return {
		init: _init
	};
});