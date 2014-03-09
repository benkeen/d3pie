define([
	"constants",
	"mediator",
	"utils",
	"hbs!labelsTabTemplate"
], function(C, mediator, utils, labelsTabTemplate) {
	"use strict";

	var _MODULE_ID = "labelsTab";
	var _openSections = {
		panelOuterLabels: true,
		panelInnerLabels: false,
		panelLabelStyles: false,
		panelLabelLines: false,
		panelTooltips: false
	};


	var _render = function(tabEl, config) {
		$(tabEl).html(labelsTabTemplate({
			config: config,
			openSections: _openSections
		}));

		utils.addColorpicker("mainLabelColor");
		utils.addColorpicker("labelPercentageColor");
		utils.addColorpicker("labelValueColor");
		utils.addColorpicker("labelLinesColor");

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		$("input[name=labelLineColorType]").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$(".panelToggle").on("click", function() {
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

//		$("#labelLinesColor").on("focus", function() {
//			$("#labelLineColorType2")[0].checked = true;
//			$("#labelLinesColorGroup").colorpicker("show");
//			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
//		});
	};


	var _getTabData = function() {
		var lineColor = "segment";
		if ($("#labelLineColorType2")[0].checked) {
			lineColor = $("#labelLinesColor").val();
		}

		var outerHideWhenLessThanPercentage = null;
		if ($("#hideOuterLabelCondition2")[0].checked) {
			var val = $("#outerHideWhenLessThanPercentage").val();
			if ($.isNumeric(val)) {
				outerHideWhenLessThanPercentage = val;
			}
		}

		var innerHideWhenLessThanPercentage = null;
		if ($("#hideInnerLabelCondition2")[0].checked) {
			var val = $("#innerHideWhenLessThanPercentage").val();
			if ($.isNumeric(val)) {
				innerHideWhenLessThanPercentage = val;
			}
		}

		return {
			enableTooltips: false, //$("#enableTooltips")[0].checked,
			outer: {
				format: $("#outerLabel").val(),
				hideWhenLessThanPercentage: outerHideWhenLessThanPercentage
			},
			inner: {
				format: $("#insideLabel").val(),
				hideWhenLessThanPercentage: innerHideWhenLessThanPercentage
			},
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
				style:   $("input[name=lineStyle]:checked").val(),
				length:  parseInt($("#labelLineLength").val(), 10),
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