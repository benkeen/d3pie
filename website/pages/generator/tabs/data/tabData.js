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
			axis: "y"
		});
	};

	var _getTabData = function() {
		var data = [];
		var trs = $("#sortableDataList li");
		for (var i=0; i<trs.length; i++) {
			data.push({
				label:   $(trs[i]).find(".dataLabel").val(),
				value:   parseInt($(trs[i]).find(".dataValue").val(), 10), // TODO - need validation
				tooltip: $(trs[i]).find(".dataTooltip").val()
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