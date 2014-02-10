define([
	"constants",
	"mediator",
	"hbs!labelsTabTemplate"
], function(C, mediator, labelsTabTemplate) {
	"use strict";

	var _MODULE_ID = "labelsTab";

	var _render = function(config) {
		$("#labelsTab").html(labelsTabTemplate({ config: config }));

		$("#labelColorGroup").colorpicker();
		$("#labelPercentageColorGroup").colorpicker();
		$("#labelValueColor").colorpicker();
		$("#labelLinesColorGroup").colorpicker();

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});
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