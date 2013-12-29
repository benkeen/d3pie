define([
	"hbs!aboutPageTemplate"
], function(aboutPageTemplate) {
	"use strict";

	var _init = function() {
		$("#aboutPage").html(aboutPageTemplate());
	};

	return {
		init: _init
	};
});