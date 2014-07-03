define([
	"constants",
	"mediator",
	"handlebars",
	"utils",
	"colorsets",
	"hbs!dataTabTemplate",
	"hbs!dataRowPartial"
], function(C, mediator, Handlebars, utils, COLORSETS, dataTabTemplate, dataRowPartial) {
	"use strict";

	var _MODULE_ID = "dataTab";
	var _$sortableDataList;
	var _openSections = {
		panelData: false,
		panelSmallSegmentGrouping: true
	};

	var _init = function() {
		Handlebars.registerPartial("data-row", dataRowPartial);
		mediator.register(_MODULE_ID);
	};

	var _render = function(tabEl, config) {
		var $dataTab = $(tabEl);

		$dataTab.html(dataTabTemplate({
			config: config,
			colorsets: COLORSETS,
			openSections: _openSections
		}));

		$(".panelDataSectionToggle").on("click", function() {
			var $sectionHeading = $(this);
			var section = $sectionHeading.data("section");
			var $el = $("#" + section);
			if ($sectionHeading.hasClass("expanded")) {
				$el.hide("blind", function() { $sectionHeading.removeClass("expanded"); });
				_openSections[section] = false;
			} else {
				$el.css("display", "none").removeClass("hidden").show("blind", function() { $sectionHeading.addClass("expanded"); });
				_openSections[section] = true;
			}
		});

		var groupSmallDataSegments = $("#groupSmallDataSegments");
		groupSmallDataSegments.on("click", function() {
			var section = $("#panelSmallSegmentGrouping");
			var labels      = section.find("label");
			var inputFields = section.find("input, select");
			if (this.checked) {
				labels.removeClass("disabled");
				inputFields.removeAttr("disabled");
			} else {
				labels.addClass("disabled");
				inputFields.attr("disabled", "disabled");
				$("#groupSmallDataSegments").removeAttr("disabled");
				$("#groupSmallDataSegmentsEnabled").removeClass("disabled");
			}
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		_$sortableDataList = $("#sortableDataList");
		_$sortableDataList.find(".segmentColor").colorpicker().on("changeColor", function(e) {
			$(e.target).css("background-color", e.color.toHex());
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		// make the data vertically sortable
		_$sortableDataList.sortable({
			handle: ".handle",
			axis: "y",
			update: function() {
				_updateCounter();
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});

		_$sortableDataList.on("click", ".removeRow", _removeRow);
		$("#colorSets").on("change", _selectColorset);
		$("#shuffleColors").on("click", _randomizeColorset);
		$("#addRow").on("click", _addRow);
		_$sortableDataList.on("keyup", ".dataLabel", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$("#smallSegmentGroupingValueType").on("change", function() {
			if (this.value === "percentage") {
				$("#smallSegmentPercentageUnit").show();
			} else {
				$("#smallSegmentPercentageUnit").hide();
			}
		});

		utils.addColorpicker("smallSegmentColor");
	};

	var _addRow = function(e) {
		e.preventDefault();
		_$sortableDataList.append(dataRowPartial({ color: "#efefef" }));
		_updateCounter();

		_$sortableDataList.children().last().find(".segmentColor").colorpicker().on("changeColor", function(e) {
			$(e.target).css("background-color", e.color.toHex());
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});
	};

	var _removeRow = function(e) {
		$(e.target).closest("li").remove();
		_updateCounter();
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _getTabData = function() {
		var data = [];
		var trs = _$sortableDataList.find("li");
		for (var i=0; i<trs.length; i++) {
			var row = $(trs[i]);
			data.push({
				label: row.find(".dataLabel").val(),
				value: parseFloat(row.find(".dataValue").val()),
				color: utils.rgb2hex(row.find(".segmentColor").css("background-color"))
			});
		}
		return {
			sortOrder: $("#dataSortOrder").val(),
			smallSegmentGrouping: {
				enabled:   $("#groupSmallDataSegments")[0].checked,
				value:     parseFloat($("#smallSegmentGroupingValue").val()),
				valueType: $("#smallSegmentGroupingValueType").val(),
				label:     $("#smallSegmentGroupingLabel").val(),
				color:     $("#smallSegmentColor").val()
			},
			content: data
		};
	};

	/**
	 * Randomizes whatever colors are currently being used.
	 * @private
	 */
	var _randomizeColorset = function() {
		var colors = []
		var trs = _$sortableDataList.find("li");
		for (var i=0; i<trs.length; i++) {
			colors.push(utils.rgb2hex($(trs[i]).find(".segmentColor").css("background-color")));
		}
		colors = utils.shuffleArray(colors);
		_setColors(colors);
	};

	var _selectColorset = function(e) {
		var parts = e.target.value.split("-");
		if (parts.length !== 2) {
			return;
		}
		var group = parts[0];
		var index = parts[1];

		var colors = [];
		if (group === "default") {
			colors = defaultSettings.misc.colors.segments;
		} else {
			colors = COLORSETS[group][index].colors;
		}
		_setColors(colors);

		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _setColors = function(colors) {
		// reset them all to black - we want any superfluous entries to be clearly shown to be black - users
		// can always change them
		_$sortableDataList.find(".segmentColor").css("backgroundColor", "#000000").attr("data-color", "#000000");

		var trs = _$sortableDataList.find("li");
		for (var i=0; i<trs.length; i++) {
			$(trs[i]).find(".segmentColor").colorpicker("setValue", colors[i]);
		}
	};

	var _updateCounter = function() {
		var trs = _$sortableDataList.find(".dataRowIndex");
		for (var i=0; i<trs.length; i++) {
			$(trs[i]).html(i+1);
		}
	};


	_init();

	return {
		render: _render,
		getTabData: _getTabData
	};
});