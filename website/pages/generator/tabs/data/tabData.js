define([
	"constants",
	"mediator",
	"utils",
	"handlebars",
	"hbs!dataTabTemplate",
	"hbs!dataRowPartial"
], function(C, mediator, utils, Handlebars, dataTabTemplate, dataRowPartial) {
	"use strict";

	var _MODULE_ID = "dataTab";


	var _init = function() {
		Handlebars.registerPartial("data-row", dataRowPartial);
		mediator.register(_MODULE_ID);

		window.outputColors = _outputColors;
	};

	var _render = function(tabEl, config) {
		var $dataTab = $(tabEl);
		$dataTab.html(dataTabTemplate({ config: config }));

		$("#sortableDataList").find(".segmentColor").colorpicker().on("changeColor", function(e) {
			$(e.target).css("background-color", e.color.toHex());
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

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
				value: parseInt(row.find(".dataValue").val(), 10),
				color: utils.rgb2hex(row.find(".segmentColor").css("background-color"))
			});
		}

		return {
			sortOrder: $("#dataSortOrder").val(),
			content: data
		};
	};

	var _outputColors = function() {
		var colors = [];
		var trs = $("#sortableDataList li");
		for (var i=0; i<trs.length; i++) {
			var row = $(trs[i]);
			colors.push(utils.rgb2hex(row.find(".segmentColor").css("background-color")));
		}
		console.log(colors);
	};


	var colors = function() {
		var greys = ["#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#afafaf", "#bcbcbc", "#d8d8d8"];
		var blues = ["#00047c", "#2f3399", "#2f52aa", "#2e59c9", "#4d70cc", "#738eef", "#77a0dd", "#9db5f2", "#bccff2", "#d7e5f7"];
	};

	_init();

	return {
		render: _render,
		getTabData: _getTabData
	};
});