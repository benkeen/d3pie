define([
	"constants",
	"mediator",
	"hbs!effectsTabTemplate"
], function(C, mediator, effectsTabTemplate) {
	"use strict";

	var _MODULE_ID = "effectsTab";

	var _render = function(tabEl, config) {
		$(tabEl).html(effectsTabTemplate({ config: config }));

		// row 1
		$("#loadEffect").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.load.effect", value: this.value });
		});
		$("#loadEffectSpeed").on("change", function() {
			var speed = parseInt(this.value, 10);
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
			var speed = parseInt(this.value, 10);
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.pullOutSegmentOnClick.speed", value: speed });
		});
		$("#pullOutSegmentOnClickEffectSize").on("change", function() {
			var size = parseInt(this.value, 10);
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.pullOutSegmentOnClick.size", value: size });
		});
		$("#pullOutSegmentOnClickEffectBtn").on("click", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.SELECT_SEGMENT);
		});

		$("#highlightSegmentOnMouseover").on("click", function() {
			$("#highlightLuminosity")[0].disabled = !this.checked;
			var $labels = $("#highlightLuminosityScaleLabels").find("label");
			if (this.checked) {
				$labels.removeClass("disabled");
			} else {
				$labels.addClass("disabled");
			}
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.highlightSegmentOnMouseover", value: this.checked });
		});

		$("#highlightLuminosity").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, { prop: "effects.highlightLuminosity", value: this.value });
		})
	};


	var _getTabData = function() {
		return {
			load: {
				effect: $("#loadEffect").val(),
				speed: $("#loadEffectSpeed").val()
			},
			pullOutSegmentOnClick: {
				effect: $("#pullOutSegmentOnClickEffect").val(),
				speed: $("#pullOutSegmentOnClickEffectSpeed").val(),
				size: $("#pullOutSegmentOnClickEffectSize").val()
			},
			highlightSegmentOnMouseover: $("#highlightSegmentOnMouseover")[0].checked,
			highlightLuminosity: $("#highlightLuminosity").val()
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});