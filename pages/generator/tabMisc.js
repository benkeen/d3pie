define([
	"constants",
	"mediator",
	"hbs!miscTabTemplate"
], function(C, mediator, miscTabTemplate) {
	"use strict";

	var _MODULE_ID = "miscTab";

	var _render = function(config) {
		$("#miscTab").html(miscTabTemplate({ config: config }));
	};

	var _getTabData = function() {
		// TODO validation

		return {
			dataSortOrder: $("#dataSortOrder").val(),
			canvasPadding: {
				top: parseInt($("#canvasPaddingTop").val(), 10),
				right: parseInt($("#canvasPaddingRight").val(), 10),
				bottom: parseInt($("#canvasPaddingBottom").val(), 10),
				left: parseInt($("#canvasPaddingLeft").val(), 10)
			},
			titleSubtitlePadding: parseInt($("#titleSubtitlePadding").val(), 10),
			labelPieDistance: parseInt($("#labelPieDistance").val(), 10)
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});