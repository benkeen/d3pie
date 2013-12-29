define([
	"constants",
	"generatorTabs",
	"pieChartGenerator",
	"hbs!generatorPageTemplate"
], function(C, generatorTabs, pieChartGenerator, generatorPageTemplate) {
	"use strict";

	var _init = function() {
		$("#generatorPage").html(generatorPageTemplate());

		generatorTabs.init();
		pieChartGenerator.init();

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent, #footerRow").hide().removeClass("hidden").fadeIn(400);
	};

	return {
		init: _init
	};
})