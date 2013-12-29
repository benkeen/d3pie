define([
	"hbs!downloadPageTemplate"
], function(downloadPageTemplate) {
	"use strict";

	var _init = function() {
		$("#downloadPage").html(downloadPageTemplate());
	};

	return {
		init: _init
	};
});