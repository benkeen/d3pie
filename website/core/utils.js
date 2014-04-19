/**
 * Misc utility functions, used throughout the code.
 */
define([
	"constants",
	"mediator"
], function(C, mediator) {
	"use strict";

	var _MODULE_ID = "utils";
	var _colorpickers = {};


	var _addColorpicker = function(id) {
		var $inputField = $("#" + id);

		// this just overwrites any older one that happened to be there with the same ID
		_colorpickers[id] = {
			manuallyChanged: false,
			previousColor: ""
		};

		$inputField.on("input", function() {
			var newValue = this.value;
			_colorpickers[id].manuallyChanged = true;
			if (_colorpickers[id].previousColor !== newValue && newValue.length === 7) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_colorpickers[id].previousColor = newValue;
			}
		});
		$inputField.on("focus", function() {
			$("#" + id + "Group").colorpicker("show");
		});

		$("#" + id + "Group").colorpicker().on("changeColor", _onColorChangeViaColorPicker);
	};

	var _onColorChangeViaColorPicker = function(e) {
		var newValue = e.color.toHex();
		var id = e.target.id.replace(/Group$/, "");
		if (_colorpickers[id].previousColor !== newValue && newValue.length === 7 && !_colorpickers[id].manuallyChanged) {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_colorpickers[id].previousColor = newValue;
		}
		_colorpickers[id].manuallyChanged = false;
	};

	var _rgb2hex = function(rgb) {
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		if (rgb.search("rgb") == -1) {
			return rgb;
		} else {
			rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
	};

	var _shuffleArray = function(array) {
		var copy = $.extend(true, [], array);
		var currentIndex = copy.length, tmpVal, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// and swap it with the current element
			tmpVal = copy[currentIndex];
			copy[currentIndex] = copy[randomIndex];
			copy[randomIndex] = tmpVal;
		}
		return copy;
	};

	// ------------------------------------------

	/**
	 * Provides requestAnimationFrame/cancelRequestAnimation in a cross browser way.
	 * from paul irish + jerome etienne
	 * - http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 * - http://notes.jetienne.com/2011/05/18/cancelRequestAnimFrame-for-paul-irish-requestAnimFrame.html
	 */
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (function() {
			return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
					return window.setTimeout( callback, 1000 / 60 );
				};
		} )();
	}

	if (!window.cancelRequestAnimationFrame ) {
		window.cancelRequestAnimationFrame = (function() {
			return window.webkitCancelRequestAnimationFrame ||
				window.mozCancelRequestAnimationFrame ||
				window.oCancelRequestAnimationFrame ||
				window.msCancelRequestAnimationFrame ||
				clearTimeout

		})();
	}

	// ------------------------------------------

	return {
		addColorpicker: _addColorpicker,
		rgb2hex: _rgb2hex,
		shuffleArray: _shuffleArray
	};
});