define([
	"constants",
	"mediator",
	"hbs!sizeTabTemplate"
], function(C, mediator, sizeTabTemplate) {
	"use strict";

	var _MODULE_ID = "sizeTab";

	var _init = function() {
		mediator.register(_MODULE_ID);
	};

	var _render = function(config) {
		$("#sizeTab").html(sizeTabTemplate({ config: config }));

		// 2. size tab
		$("#showCanvasOutline").on("click", function(e) {
			if (e.target.checked) {
				$("#generatorPieChart").addClass("showOutline");
			} else {
				$("#generatorPieChart").removeClass("showOutline");
			}
		});
		$("#pieInnerRadius").on("change", _onChangeInnerRadius);
		$("#pieOuterRadius").on("change", _onChangeOuterRadius);
	};

	var _onChangeInnerRadius = function(e) {
		$("#pieInnerRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _getTabData = function() {
		return {

		};
	};

	return {
		init: _init,
		render: _render,
		getTabData: _getTabData
	};
});