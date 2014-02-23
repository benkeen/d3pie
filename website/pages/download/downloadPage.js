define([
	"hbs!downloadPageTemplate"
], function(downloadPageTemplate) {
	"use strict";

	var _init = function() {
		$("#download").html(downloadPageTemplate());
	};

	return {
		init: _init
	};
});