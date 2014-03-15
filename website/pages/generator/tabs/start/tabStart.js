define([
	"constants",
	"mediator",
	"utils",
	"examplePies",
	"hbs!startTabTemplate",
	"hbs!examplePiesTemplate"
], function(C, mediator, utils, EXAMPLE_PIES, startTabTemplate, examplePiesTemplate) {
	"use strict";

	var _MODULE_ID = "startTab";
	var _isLoaded = false;


	var _render = function(tabEl, config) {
		if (_isLoaded) {
			return;
		}

		$(tabEl).html(startTabTemplate({
			examples: examplePiesTemplate({ examples: EXAMPLE_PIES }),
			currentExamplePieName: EXAMPLE_PIES[0].label
		}));

		$("#exampleDropdown").on("click", "ul li a", function(e) {
			e.preventDefault();
			var index = parseInt($(e.target).data("index"), 10);
			$("#currentExamplePieName").text(EXAMPLE_PIES[index].label);
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.LOAD, { index: index });
		});

		_isLoaded = true;
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render
	};
});