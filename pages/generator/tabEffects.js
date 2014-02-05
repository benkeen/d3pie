define([
	"constants",
	"mediator",
	"hbs!effectsTabTemplate"
], function(C, mediator, effectsTabTemplate) {
	"use strict";

	var _MODULE_ID = "effectsTab";

	var _render = function(config) {
		$("#effectsTab").html(effectsTabTemplate({ config: config }));

		$("#loadEffect").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION);
		});
	};

	var _getTabData = function() {
		return {
			loadEffect: $("#loadEffect").val(),
			loadEffectSpeed: $("#loadEffectSpeed").val(),
			highlightSegmentOnMouseover: $("#highlightSegmentOnMouseover")[0].checked,
			pullOutSegmentOnClick: $("#pullOutSegmentOnClick")[0].checked,
			labelFadeInTime: 400
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});