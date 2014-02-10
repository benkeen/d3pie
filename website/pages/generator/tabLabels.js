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

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});
	};

	var _getTabData = function() {

			/*
			enableTooltips: true,
			inside: "none",
			outside: "label",
			mainLabel: {
			color: "#333333",
				font: "",
				fontSize: ""
			},
			percentage: {
				color: "#999999",
				font: "",
				fontSize: ""
			},
			value: {
				color: "#cccc44",
					font: "",
					fontSize: ""
			},
			lines: {
				enabled: true,
					color: "segment" // "segment" or a hex color
			}
			*/


		return {
			enableTooltips: $("#enableTooltips")[0].checked,
			inside:         $("#insideLabel").val(),
			outside:        $("#outsideLabel").val(),
			labelColor: $("#labelColor").val(),
			labelPercentageColor: $("#labelPercentageColor").val(),
			labelSegmentValueColor: $("#labelSegmentValueColor").val()
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});