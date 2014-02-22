define([
	"constants",
	"mediator",
	"hbs!effectsTabTemplate"
], function(C, mediator, effectsTabTemplate) {
	"use strict";

	var _MODULE_ID = "effectsTab";

	var _render = function(config) {
		$("#effectsTab").html(effectsTabTemplate({ config: config }));

		// row 1
		$("#loadEffect").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.load.effect", value: this.value });
		});
		$("#loadEffectSpeed").on("change", function() {
			var speed = parseInt(this.value, 10); // TODO validate
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.load.speed", value: speed });
		});
		$("#loadEffectBtn").on("click", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION);
		});

		// row 2
		$("#pullOutSegmentOnClickEffect").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.pullOutSegmentOnClick.effect", value: this.value });
		});
		$("#pullOutSegmentOnClickEffectSpeed").on("change", function() {
			var speed = parseInt(this.value, 10); // TODO validate
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.pullOutSegmentOnClick.speed", value: speed });
		});
		$("#pullOutSegmentOnClickEffectBtn").on("click", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.SELECT_SEGMENT);
		});
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