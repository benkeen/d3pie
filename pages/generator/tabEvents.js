define([
	"constants",
	"mediator",
	"hbs!eventsTabTemplate"
], function(C, mediator, eventsTabTemplate) {
	"use strict";

	var _MODULE_ID = "eventsTab";

	// this module's a mess




	var _render = function(config) {

		// tack on the callbacks. These can't be edited - they're just included so the user (developer, really)
		// can see them get fired & so that they're included in the
		config.callbacks = {
			onload: "function() { console.log(\"loaded.\"); }",
			onMouseoverSegment: "function(seg) { console.log(\"mouseover:\", seg); }",
			onMouseoutSegment: "function(seg) { console.log(\"mouseout:\", seg); }",
			onClickSegment: "function(seg) { console.log(\"click:\", seg); }"
		};

		$("#eventsTab").html(eventsTabTemplate({
			config: config
		}));


		$(".callbackCheckbox").on("change", _onChangeCheckbox);
	};

	var _onChangeCheckbox = function(e) {
		var isChecked = e.target.checked;
		var prop = $(e.target).data("prop");
		var $callbackCode = $(e.target).closest(".row").find(".callbackCode");

		if (isChecked) {
			$callbackCode.removeClass("disabledText");
		} else {
			$callbackCode.addClass("disabledText");
		}

		// bah!
		var func = null;
		switch (prop) {
			case "callbacks.onload":
				func = function() { console.log("loaded."); };
				break;
			case "callbacks.onMouseoverSegment":
				func = function(seg) { console.log("mouseover:", seg); };
				break;
			case "callbacks.onMouseoutSegment":
				func = function(seg) { console.log("mouseout:", seg); };
				break;
			case "callbacks.onClickSegment":
				func = function(seg) { console.log("click:", seg); };
				break;
		}

		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, {
			prop: prop,
			value: func
		});
	}

	var _getTabData = function() {
		var onload = ($("#"))
		return {
			onload:
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});