define([
	"constants",
	"mediator",
	"handlebars",
	"hbs!dataTabTemplate",
	"hbs!dataRowPartial"
], function(C, mediator, Handlebars, dataTabTemplate, dataRowPartial) {
	"use strict";

	var _MODULE_ID = "dataTab";


	var _init = function() {
		Handlebars.registerPartial("data-row", dataRowPartial);
		mediator.register(_MODULE_ID);
	};

	var _render = function(tabEl, config) {
		var $dataTab = $(tabEl);
		$dataTab.html(dataTabTemplate({ config: config }));

		// make the data vertically sortable
		$("#sortableDataList").sortable({
			handle: ".handle",
			axis: "y",
			update: function() {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});

		$("#sortableDataList").on("click", ".removeRow", _removeRow);
		$("#addRow").on("click", _addRow);
	};

	var _addRow = function(e) {
		e.preventDefault();
		$("#sortableDataList").append(dataRowPartial());
	};

	var _removeRow = function(e) {
		$(e.target).closest("li").remove();
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _getTabData = function() {
		var data = [];
		var trs = $("#sortableDataList li");
		for (var i=0; i<trs.length; i++) {
			var row = $(trs[i]);
			data.push({
				label: row.find(".dataLabel").val(),
				value: parseInt(row.find(".dataValue").val(), 10)
			})
		}
		return data;
	};


	_init();

	return {
		render: _render,
		getTabData: _getTabData
	};
});