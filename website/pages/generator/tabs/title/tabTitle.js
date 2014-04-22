define([
	"constants",
	"mediator",
	"utils",
	"hbs!titleTabTemplate"
], function(C, mediator, utils, titleTabTemplate) {
	"use strict";

	var _MODULE_ID = "titleTab";
	var _previousTitle = null;
	var _previousSubtitle = null;


	var _render = function(tabEl, config) {
		$(tabEl).html(titleTabTemplate({ config: config }));

		$("#pieTitle").on("keyup", function() {
			if (_previousTitle !== this.value) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, {
					prop: "header.title.text",
					value: this.value
				});
				_previousTitle = this.value;
			}
		});
		$("#pieSubtitle").on("keyup", function() {
			if (_previousSubtitle !== this.value) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, {
					prop: "header.subtitle.text",
					value: this.value
				});
				_previousSubtitle = this.value;
			}
		});

		utils.addColorpicker("titleColor");
		utils.addColorpicker("subtitleColor");
	};

	var _getTabData = function() {
		var data = {
			title: {
				text:     $("#pieTitle").val(),
				color:    $("#titleColor").val(),
				font:     $("#titleFont").val()
			},
			subtitle: {
				text:     $("#pieSubtitle").val(),
				color:    $("#subtitleColor").val(),
				font:     $("#subtitleFont").val()
			},
			location: $("#titleLocation").val()
		};

		// validation. If none are these are entered properly, it relies on the default values in d3pie to handle them.
		// The error class
		var numberRegExp = /^[\d]+$/;
		var titleFontSize = $("#titleFontSize").val();
		if (numberRegExp.test(titleFontSize)) {
			data.title.fontSize = titleFontSize;
		}
		var subtitleFontSize = $("#subtitleFontSize").val();
		if (numberRegExp.test(subtitleFontSize)) {
			data.subtitle.fontSize = subtitleFontSize;
		}
		var titleSubtitlePadding = $("#titleSubtitlePadding").val();
		if (numberRegExp.test(titleSubtitlePadding)) {
			data.titleSubtitlePadding = parseInt(titleSubtitlePadding, 10);
		}

		return data;
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});