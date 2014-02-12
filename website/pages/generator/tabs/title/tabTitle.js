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


	var _render = function(config) {
		$("#titleTab").html(titleTabTemplate({ config: config }));

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
		return {
			title: {
				text:     $("#pieTitle").val(),
				color:    $("#titleColor").val(),
				fontSize: $("#titleFontSize").val() + "px",
				font:     $("#titleFont").val()
			},
			subtitle: {
				text:     $("#pieSubtitle").val(),
				color:    $("#subtitleColor").val(),
				fontSize: $("#subtitleFontSize").val() + "px",
				font:     $("#subtitleFont").val()
			},
			location: $("#titleLocation").val()
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});