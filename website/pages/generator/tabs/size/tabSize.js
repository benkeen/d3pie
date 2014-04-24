define([
	"constants",
	"mediator",
	"hbs!sizeTabTemplate"
], function(C, mediator, sizeTabTemplate) {
	"use strict";

	var _MODULE_ID = "sizeTab";

	var _render = function(tabEl, config, showOutline) {
		$(tabEl).html(sizeTabTemplate({
			config: config,
			showOutline: showOutline
		}));

		_toggleOutline(showOutline);
		$("#showCanvasOutline").on("click", function(e) {
			_toggleOutline(e.target.checked);
		});

		var $pieInnerRadius = $("#pieInnerRadius");
		$pieInnerRadius.on("input change", _onChangeInnerRadius);
		$("#pieOuterRadius").on("input change", _onChangeOuterRadius);

		$("#pieIconPie").on("click", function() {
			$pieInnerRadius.val("0");
			_setInnerRadiusDisplayValue("0");
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});
		$("#pieIconDonut").on("click", function() {
			$pieInnerRadius.val("100");
			_setInnerRadiusDisplayValue("100");
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});
	};

	var _onChangeInnerRadius = function(e) {
		_setInnerRadiusDisplayValue(e.target.value);
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _setInnerRadiusDisplayValue = function(val) {
		$("#pieInnerRadiusDisplayValue").html(val + "%");
	};

	var _toggleOutline = function(show) {
		if (show) {
			$("#generatorPieChart").addClass("showOutline");
		} else {
			$("#generatorPieChart").removeClass("showOutline");
		}
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