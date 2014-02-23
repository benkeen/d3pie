define([
	"constants",
	"mediator",
	"hbs!sizeTabTemplate"
], function(C, mediator, sizeTabTemplate) {
	"use strict";

	var _MODULE_ID = "sizeTab";


	var _render = function(tabEl, config) {
		$(tabEl).html(sizeTabTemplate({ config: config }));

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
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _getTabData = function() {
		return {
			canvasWidth:    $("#canvasWidth").val(),
			canvasHeight:   $("#canvasHeight").val(),
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			pieOuterRadius: $("#pieOuterRadius").val() + "%"
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});