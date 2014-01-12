define([
	"constants",
	"pieChartGenerator",
	"hbs!examplePiesTemplate",
	"hbs!generatorPageTemplate"
], function(C, pieChartGenerator, examplePiesTemplate, generatorPageTemplate) {
	"use strict";

	var _init = function() {

		$("#generatorPage").html(generatorPageTemplate({
			examples: examplePiesTemplate({ examples: C.EXAMPLE_PIES })
		}));
		pieChartGenerator.init();

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent, #footerRow").hide().removeClass("hidden").fadeIn(400);

		_addEventHandlers();
	};

	// gah. Either we add in a mediator, or move this to the generator itself...
	var _addEventHandlers = function() {
		$("#exampleDropdown").on("click", "ul li a", function(e) {
			var index = parseInt($(e.target).data("index"), 10);

			// publish ...
		});
	};

	return {
		init: _init
	};
});