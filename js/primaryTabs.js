define([
	"constants",
	"hbs!primaryTabsTemplate",
	"hbs!examplePiesTemplate"
], function(C, primaryTabsTemplate, examplePiesTemplate) {

	/**
	 * Our main initialization function. This creates the appropriate markup for the primary tabs and inserts
	 * it into the page.
	 * @private
	 */
	var _init = function() {

		var examplePieOptions = examplePiesTemplate({ examples: C.EXAMPLE_PIES });

		console.log(examplePieOptions);

		$("#primaryTabs").html(primaryTabsTemplate({
			examples: examplePieOptions
		}));
	};

	return {
		init: _init
	};
})