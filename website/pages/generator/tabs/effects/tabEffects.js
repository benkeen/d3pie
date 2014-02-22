define([
	"constants",
	"mediator",
	"hbs!effectsTabTemplate"
], function(C, mediator, effectsTabTemplate) {
	"use strict";

	var _MODULE_ID = "effectsTab";

	var _render = function(config) {
		$("#effectsTab").html(effectsTabTemplate({ config: config }));

		$("#loadEffectBtn").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION);
		});
		$("#pullOutSegmentOnClickEffect").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.pullOutSegmentOnClick.effect", value: this.value });
		});
		$("#pullOutSegmentOnClickEffectBtn").on("click", _runPieSegmentClickEffect);
	};

	var _runPieSegmentClickEffect = function() {
		console.log($("#generatorPieChart").data("d3pie").getOpenPieSegment());

		//mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION);
	};

	var _getTabData = function() {
		return {
			load: {
				effect: $("#loadEffect").val(),
				speed: $("#loadEffectSpeed").val()
			},
			pullOutSegmentOnClick: {
				effect: $("#pullOutSegmentOnClickEffect").val(),
				speed: $("#pullOutSegmentOnClickEffectSpeed").val()
			},
			highlightSegmentOnMouseover: $("#highlightSegmentOnMouseover")[0].checked,
			labelFadeInTime: 400
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});