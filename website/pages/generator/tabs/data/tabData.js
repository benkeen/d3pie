define([
	"constants",
	"mediator",
	"utils",
	"handlebars",
	"colorsets",
	"hbs!dataTabTemplate",
	"hbs!dataRowPartial"
], function(C, mediator, utils, Handlebars, COLORSETS, dataTabTemplate, dataRowPartial) {
	"use strict";

	var _MODULE_ID = "dataTab";


	var _init = function() {
		Handlebars.registerPartial("data-row", dataRowPartial);
		mediator.register(_MODULE_ID);

		// temporary
		window.outputColors = _outputColors;
	};

	var _render = function(tabEl, config) {
		var $dataTab = $(tabEl);

		$dataTab.html(dataTabTemplate({
			config: config,
			colorsets: COLORSETS
		}));

		$("#sortableDataList").find(".segmentColor").colorpicker().on("changeColor", function(e) {
			$(e.target).css("background-color", e.color.toHex());
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		// make the data vertically sortable
		$("#sortableDataList").sortable({
			handle: ".handle",
			axis: "y",
			update: function() {
				_updateCounter();
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});

		$("#sortableDataList").on("click", ".removeRow", _removeRow);
		$("#colorSets").on("change", _selectColorset);
		$("#shuffleColors").on("click", _randomizeColorset);
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
		var trs = $("#sortableDataList").find("li");
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

	/**
	 * Randomizes whatever colors are currently being used.
	 * @private
	 */
	var _randomizeColorset = function() {
		var colors = []
		var trs = $("#sortableDataList").find("li");
		for (var i=0; i<trs.length; i++) {
			colors.push(utils.rgb2hex($(trs[i]).find(".segmentColor").css("background-color")));
		}
		colors = utils.shuffleArray(colors);
		_setColors(colors);

//		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _selectColorset = function(e) {
		var parts = e.target.value.split("-");
		if (parts.length !== 2) {
			return;
		}

		var group = parts[0];
		var index = parts[1];
		var colors = COLORSETS[group][index].colors;
		_setColors(colors);

		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _setColors = function(colors) {
		// reset them all to black - we want any superfluous entries to be clearly shown to be black - users
		// can always change them
		$("#sortableDataList").find(".segmentColor").css("backgroundColor", "#000000").attr("data-color", "#000000");

		var trs = $("#sortableDataList").find("li");
		for (var i=0; i<trs.length; i++) {
			//$(trs[i]).find(".segmentColor").css("backgroundColor", colors[i]).attr("data-color", colors[i]);
			$(trs[i]).find(".segmentColor").colorpicker("setValue", colors[i]);
		}
	};

	var _updateCounter = function() {
		var trs = $("#sortableDataList").find(".dataRowIndex");
		for (var i=0; i<trs.length; i++) {
			$(trs[i]).html(i+1);
		}
	};

	var _outputColors = function() {
		var colors = [];
		var trs = $("#sortableDataList li");
		for (var i=0; i<trs.length; i++) {
			colors.push(utils.rgb2hex($(trs[i]).find(".segmentColor").css("background-color")));
		}
		console.log(colors);
	};


	_init();

	return {
		render: _render,
		getTabData: _getTabData
	};
});