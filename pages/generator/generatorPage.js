define([
	"constants",
	"pieChartGenerator",
	"hbs!examplePiesTemplate",
	"hbs!generatorPageTemplate"
], function(C, pieChartGenerator, examplePiesTemplate, generatorPageTemplate) {
	"use strict";

	var _init = function() {

		$("#generatorPage").html(generatorPageTemplate({ examples: C.EXAMPLE_PIES }));

//		var html = examplePiesTemplate({ examples: C.EXAMPLE_PIES });
//		$("#generatorTabs").html(generatorTabsTemplate({
//			examples: html
//		}));

		pieChartGenerator.init();

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent, #footerRow").hide().removeClass("hidden").fadeIn(400);
	};

	return {
		init: _init
	};
});