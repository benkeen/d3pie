define([
	"constants",
	"mediator",
	"hbs!labelsTabTemplate"
], function(C, mediator, labelsTabTemplate) {
	"use strict";

	var _MODULE_ID = "labelsTab";
	var _previousLineColor = null;
	var _lineColorManuallyChanged = false;


	var _render = function(config) {
		$("#labelsTab").html(labelsTabTemplate({ config: config }));

		$("#labelColorGroup").colorpicker();
		$("#labelPercentageColorGroup").colorpicker();
		$("#labelValueColor").colorpicker();
		$("#labelLinesColorGroup").colorpicker().on("changeColor", _onLabelLinesColorChangeViaColorPicker);

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		$("input[name=labelLineColorType]").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$("#labelLinesColor").on("focus", function() {
			$("#labelLineColorType2")[0].checked = true;
			$("#labelLinesColorGroup").colorpicker("show");
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});
	};

	var _onLabelLinesColorChangeViaColorPicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousLineColor !== newValue && newValue.length === 7 && !_lineColorManuallyChanged) {
			$("#backgroundColor2")[0].checked = true;
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_previousLineColor = newValue;
		}
		_lineColorManuallyChanged = false;
	};


	var _getTabData = function() {
		var lineColor = "segment";
		if ($("#labelLineColorType2")[0].checked) {
			lineColor = $("#labelLinesColor").val();
		}

		return {
			enableTooltips: $("#enableTooltips")[0].checked,
			inside:         $("#insideLabel").val(),
			outside:        $("#outsideLabel").val(),
			mainLabel: {
				color:    $("#mainLabelColor").val(),
				font:     $("#mainLabelFont").val(),
				fontSize: $("#mainLabelFontSize").val()
			},
			percentage: {
				color:    $("#labelPercentageColor").val(),
				font:     $("#labelPercentageFont").val(),
				fontSize: $("#labelPercentageFontSize").val()
			},
			value: {
				color:    $("#labelValueColor").val(),
				font:     $("#labelValueFont").val(),
				fontSize: $("#labelValueFontSize").val()
			},
			lines: {
				enabled: $("#showLabelLines")[0].checked,
				color:   lineColor
			}
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});