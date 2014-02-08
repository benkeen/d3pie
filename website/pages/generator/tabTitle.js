define([
	"constants",
	"mediator",
	"hbs!titleTabTemplate"
], function(C, mediator, titleTabTemplate) {
	"use strict";

	var _MODULE_ID = "titleTab";


	var _previousTitle = null;
	var _previousSubtitle = null;
	var _previousTitleColor = null;
	var _previousSubtitleColor = null;
	var _titleColorManuallyChanged = null;
	var _subtitleColorManuallyChanged = null;


	var _render = function(config) {
		$("#titleTab").html(titleTabTemplate({ config: config }));

		_previousTitle = config.header.title.text;
		_previousSubtitle = config.header.subtitle.text;
		_previousTitleColor = config.header.title.color;
		_previousSubtitleColor = config.header.subtitle.text;

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

		// bit confusing, but necessary. The color can be changed via two methods: by editing the input field
		// or by selecting a color via the colorpicker. The former still triggers a "changed" event on the colorpicker
		// so we need to tell it that the user just did it manually. That prevents unnecessary re-draws.
		$("#titleColor").on("input", function() {
			var newValue = this.value;
			_titleColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_previousTitleColor = newValue;
			}
		});
		$("#titleColorGroup").colorpicker().on("changeColor", _onTitleColorChangeViaColorpicker);

		$("#subtitleColor").on("input", function() {
			var newValue = this.value;
			_subtitleColorManuallyChanged = true;
			if (_previousSubtitleColor !== newValue && newValue.length === 7) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_previousSubtitleColor = newValue;
			}
		});
		$("#subtitleColorGroup").colorpicker().on("changeColor", _onSubtitleColorChangeViaColorpicker);
	};

	var _onTitleColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousTitleColor !== newValue && newValue.length === 7 && !_titleColorManuallyChanged) {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_previousTitleColor = newValue;
		}
		_titleColorManuallyChanged = false;
	};

	var _onSubtitleColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousSubtitleColor !== newValue && newValue.length === 7 && !_subtitleColorManuallyChanged) {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_previousSubtitleColor = newValue;
		}
		_subtitleColorManuallyChanged = false;
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