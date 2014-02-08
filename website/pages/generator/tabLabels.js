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
		$("#labelSegmentValueColor").colorpicker();

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});
	};

	var _getTabData = function() {
		return {
			location: $("#labelLocation").val(),
			format:   $("#labelFormat").val(),
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