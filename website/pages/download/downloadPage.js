define([
	"constants",
	"hbs!downloadPageTemplate"
], function(C, downloadPageTemplate) {
	"use strict";

	var _init = function() {
		$("#download").html(downloadPageTemplate({
			version: C.VERSION
		}));
	};

	return {
		init: _init
	};
});