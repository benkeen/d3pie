define([
	"constants",
	"mediator",
	"hbs!dataTabTemplate"
], function(C, mediator, dataTabTemplate) {
	"use strict";

	var _MODULE_ID = "dataTab";

	var _render = function(config) {
		$("#dataTab").html(dataTabTemplate({ config: config }));

		// make the data vertically sortable
		$("#sortableDataList").sortable({
			handle: ".handle",
			axis: "y",
			update: function() {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});
	};

	var _getTabData = function() {
		var data = [];
		var trs = $("#sortableDataList li");
		for (var i=0; i<trs.length; i++) {
			var row = $(trs[i]);
			data.push({
				label:   row.find(".dataLabel").val(),
				value:   parseInt(row.find(".dataValue").val(), 10), // TODO - need validation
				tooltip: row.find(".dataTooltip").val(),
				xOffset: row.find(".dataOffsetX").val(),
				yOffset: row.find(".dataOffsetY").val()
			})
		}
		return data;
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});