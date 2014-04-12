define([
	"constants",
	"mediator",
	"pageHelper",
	"hbs!generateTabTemplate"
], function(C, mediator, pageHelper, generateTabTemplate) {
	"use strict";

	var _MODULE_ID = "generateTab";


	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {
		mediator.register(_MODULE_ID);

		var subscriptions = {};
		subscriptions[C.EVENT.DEMO_PIE.SEND_DATA] = _generatePie;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	var _render = function(tabEl, config) {
		$(tabEl).html(generateTabTemplate());
	};

	var _generatePie = function(msg) {
		var finalConfigObject = _generateFinalConfigObject(msg.data);
		console.log(finalConfigObject);
	};


	// yikes. The reason for all this hideousness is that we want to construct the *smallest* config object that we
	// can. So each field needs to be examined separately. I looked into object diffing scripts, but honestly there
	// was too much custom stuff needed to be done with many properties - ensuring they're the right types, etc.
	// This is prime real estate for later refactoring, but right now it's near the end of the project and I want this
	// thing out the door... don't judge me. ;-)
	var _generateFinalConfigObject = function(allSettings) {

		var finalObj = {};

		// header title
		var headerTitleTextDiff = allSettings.header.title.text != defaultSettings.header.title.text;
		var headerTitleColorDiff = allSettings.header.title.color != defaultSettings.header.title.color;
		var headerTitleFontSizeDiff = allSettings.header.title.fontSize != defaultSettings.header.title.fontSize;
		var headerTitleFontDiff = allSettings.header.title.font != defaultSettings.header.title.font;
		if (headerTitleTextDiff || headerTitleColorDiff || headerTitleFontSizeDiff || headerTitleFontDiff) {
			finalObj.header = {
				title: {}
			};
			if (headerTitleTextDiff) {
				finalObj.header.title.text = allSettings.header.title.text;
			}
			if (headerTitleColorDiff) {
				finalObj.header.title.color = allSettings.header.title.color;
			}
			if (headerTitleFontSizeDiff) {
				finalObj.header.title.fontSize = parseInt(allSettings.header.title.fontSize, 10);
			}
			if (headerTitleFontDiff) {
				finalObj.header.title.font = allSettings.header.title.font;
			}
		}

		// header subtitle
		var headerSubtitleTextDiff = allSettings.header.subtitle.text != defaultSettings.header.subtitle.text;
		var headerSubtitleColorDiff = allSettings.header.subtitle.color != defaultSettings.header.subtitle.color;
		var headerSubtitleFontSizeDiff = allSettings.header.subtitle.fontSize != defaultSettings.header.subtitle.fontSize;
		var headerSubtitleFontDiff = allSettings.header.subtitle.font != defaultSettings.header.subtitle.font;
		if (headerSubtitleTextDiff || headerSubtitleColorDiff || headerSubtitleFontSizeDiff || headerSubtitleFontDiff) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.subtitle = {};

			if (headerSubtitleTextDiff) {
				finalObj.header.subtitle.text = allSettings.header.subtitle.text;
			}
			if (headerSubtitleColorDiff) {
				finalObj.header.subtitle.color = allSettings.header.subtitle.color;
			}
			if (headerSubtitleFontSizeDiff) {
				finalObj.header.subtitle.fontSize = parseInt(allSettings.header.subtitle.fontSize, 10);
			}
			if (headerSubtitleFontDiff) {
				finalObj.header.subtitle.font = allSettings.header.subtitle.font;
			}
		}

		if (allSettings.header.location != defaultSettings.header.location) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.location = allSettings.header.location;
		}

		if (allSettings.header.titleSubtitlePadding != defaultSettings.header.titleSubtitlePadding) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.titleSubtitlePadding = parseInt(allSettings.header.titleSubtitlePadding, 10);
		}

		// footer
		var footerTextDiff = allSettings.footer.text != defaultSettings.footer.text;
		var footerColorDiff = allSettings.footer.color != defaultSettings.footer.color;
		var footerFontSizeDiff = allSettings.footer.fontSize != defaultSettings.footer.fontSize;
		var footerFontDiff = allSettings.footer.font != defaultSettings.footer.font;
		var footerLocationDiff = allSettings.footer.font != defaultSettings.footer.location;
		if (footerTextDiff || footerColorDiff || footerFontSizeDiff || footerFontDiff) {
			finalObj.footer = {};
			if (footerTextDiff) {
				finalObj.footer.text = allSettings.footer.text;
			}
			if (footerColorDiff) {
				finalObj.footer.color = allSettings.footer.color;
			}
			if (footerFontSizeDiff) {
				finalObj.footer.fontSize = parseInt(allSettings.footer.fontSize, 10);
			}
			if (footerFontDiff) {
				finalObj.footer.font = allSettings.footer.font;
			}
			if (footerLocationDiff) {
				finalObj.footer.location = allSettings.footer.location;
			}
		}

		// size
		var canvasHeightDiff = allSettings.size.canvasHeight != defaultSettings.size.canvasHeight;
		var canvasWidthDiff = allSettings.size.canvasWidth != defaultSettings.size.canvasWidth;
		var pieInnerRadiusDiff = allSettings.size.pieInnerRadius != defaultSettings.size.pieInnerRadius;
		var pieOuterRadiusDiff = allSettings.size.pieOuterRadius != defaultSettings.size.pieOuterRadius;
		if (canvasHeightDiff || canvasWidthDiff || pieInnerRadiusDiff || pieOuterRadiusDiff) {
			finalObj.size = {};
			if (canvasHeightDiff) {
				finalObj.size.canvasHeight = allSettings.size.canvasHeight;
			}
			if (canvasWidthDiff) {
				finalObj.size.canvasWidth = allSettings.size.canvasWidth;
			}
			if (pieInnerRadiusDiff) {
				finalObj.size.pieInnerRadius = allSettings.size.pieInnerRadius;
			}
			if (pieInnerRadiusDiff) {
				finalObj.size.pieOuterRadius = allSettings.size.pieOuterRadius;
			}
		}

		// data
		finalObj.data = {};
		if (allSettings.data.sortOrder != defaultSettings.data.sortOrder) {
			finalObj.data.sortOrder = allSettings.data.sortOrder;
		}
		finalObj.data.content = allSettings.data.content;

		// outer labels
		var outerLabelFormatDiff = allSettings.labels.outer.format != defaultSettings.labels.outer.format;
		var outerLabelHideDiff = allSettings.labels.outer.hideWhenLessThanPercentage != defaultSettings.labels.outer.hideWhenLessThanPercentage;
		var outerLabelPieDistDiff = allSettings.labels.outer.pieDistance != defaultSettings.labels.outer.pieDistance;
		if (outerLabelFormatDiff || outerLabelHideDiff || outerLabelPieDistDiff) {
			finalObj.labels = {
				outer: {}
			};
			if (outerLabelFormatDiff) {
				finalObj.labels.outer.format = allSettings.labels.outer.format;
			}
			if (outerLabelHideDiff) {
				finalObj.labels.outer.hideWhenLessThanPercentage = allSettings.labels.outer.hideWhenLessThanPercentage;
			}
			if (outerLabelPieDistDiff) {
				finalObj.labels.outer.pieDistance = allSettings.labels.outer.pieDistance;
			}
		}

		var innerLabelFormatDiff = allSettings.labels.inner.format != defaultSettings.labels.inner.format;
		var innerLabelHideDiff = allSettings.labels.inner.hideWhenLessThanPercentage != defaultSettings.labels.inner.hideWhenLessThanPercentage;
		if (innerLabelFormatDiff || innerLabelHideDiff) {
			if (!finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.inner = {};
			if (innerLabelFormatDiff) {
				finalObj.labels.inner.format = allSettings.labels.inner.format;
			}
			if (innerLabelHideDiff) {
				finalObj.labels.inner.hideWhenLessThanPercentage = allSettings.labels.inner.hideWhenLessThanPercentage;
			}
		}

		var mainLabelColorDiff    = allSettings.labels.mainLabel.color != defaultSettings.labels.mainLabel.color;
		var mainLabelFontDiff     = allSettings.labels.mainLabel.font != defaultSettings.labels.mainLabel.font;
		var mainLabelFontSizeDiff = allSettings.labels.mainLabel.fontSize != defaultSettings.labels.mainLabel.fontSize;
		if (mainLabelColorDiff || mainLabelFontDiff || mainLabelFontSizeDiff) {
			if (!finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.mainLabel = {};
			if (mainLabelColorDiff) {
				finalObj.labels.mainLabel.color = allSettings.labels.mainLabel.color;
			}
			if (mainLabelFontDiff) {
				finalObj.labels.mainLabel.font = allSettings.labels.mainLabel.font;
			}
			if (mainLabelFontSizeDiff) {
				finalObj.labels.mainLabel.fontSize = parseInt(allSettings.labels.mainLabel.fontSize, 10);
			}
		}

		var percentageColorDiff    = allSettings.labels.percentage.color != defaultSettings.labels.percentage.color;
		var percentageFontDiff     = allSettings.labels.percentage.font != defaultSettings.labels.percentage.font;
		var percentageFontSizeDiff = allSettings.labels.percentage.fontSize != defaultSettings.labels.percentage.fontSize;
		var percentageDecimalDiff  = allSettings.labels.percentage.decimalPlaces != defaultSettings.labels.percentage.decimalPlaces;
		if (percentageColorDiff || percentageFontDiff || percentageFontSizeDiff || percentageDecimalDiff) {
			if (!finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.percentage = {};
			if (percentageColorDiff) {
				finalObj.labels.percentage.color = allSettings.labels.percentage.color;
			}
			if (percentageFontDiff) {
				finalObj.labels.percentage.font = allSettings.labels.percentage.font;
			}
			if (percentageFontSizeDiff) {
				finalObj.labels.percentage.fontSize = parseInt(allSettings.labels.percentage.fontSize, 10);
			}
			if (percentageColorDiff) {
				finalObj.labels.percentage.decimalPlaces = parseInt(allSettings.labels.percentage.decimalPlaces, 10);
			}
		}

		var valueColorDiff    = allSettings.labels.value.color != defaultSettings.labels.value.color;
		var valueFontDiff     = allSettings.labels.value.font != defaultSettings.labels.value.font;
		var valueFontSizeDiff = allSettings.labels.value.fontSize != defaultSettings.labels.value.fontSize;
		if (valueColorDiff || valueFontDiff || valueFontSizeDiff) {
			if (!finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.value = {};
			if (valueColorDiff) {
				finalObj.labels.value.color = allSettings.labels.value.color;
			}
			if (valueFontDiff) {
				finalObj.labels.value.font = allSettings.labels.value.font;
			}
			if (valueFontSizeDiff) {
				finalObj.labels.value.fontSize = parseInt(allSettings.labels.value.fontSize, 10);
			}
		}

		// label lines
		var labelLinesDiff = allSettings.labels.lines.enabled != defaultSettings.labels.lines.enabled;
		if (!labelLinesDiff) {
			if (!finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.lines = {
				enabled: allSettings.labels.lines.enabled
			};
			if (allSettings.labels.lines.style != defaultSettings.labels.lines.style) {
				finalObj.labels.lines.style = allSettings.labels.lines.style;
			}
			if (allSettings.labels.lines.color != defaultSettings.labels.lines.color) {
				finalObj.labels.lines.color = allSettings.labels.lines.color;
			}
		}

		// effects
		var effectsLoadDiff  = allSettings.effects.load.effect != defaultSettings.effects.load.effect;
		var effectsSpeedDiff = allSettings.effects.load.speed != defaultSettings.effects.load.speed;
		if (effectsLoadDiff || effectsSpeedDiff) {
			if (!finalObj.hasOwnProperty("effects")) { finalObj.effects = {}; }
			finalObj.effects.load = {};
			if (effectsLoadDiff) {
				finalObj.effects.load.effect = allSettings.effects.load.effect;
			}
			if (effectsSpeedDiff) {
				finalObj.effects.load.speed = parseInt(allSettings.effects.load.speed, 10);
			}
		}

		var effectsPullOutDiff  = allSettings.effects.pullOutSegmentOnClick.effect != defaultSettings.effects.pullOutSegmentOnClick.effect;
		var effectsPullOutSpeedDiff  = allSettings.effects.pullOutSegmentOnClick.speed != defaultSettings.effects.pullOutSegmentOnClick.speed;
		var effectsPullOutSizeDiff  = allSettings.effects.pullOutSegmentOnClick.size != defaultSettings.effects.pullOutSegmentOnClick.size;
		if (effectsPullOutDiff || effectsPullOutSpeedDiff || effectsPullOutSizeDiff) {
			if (!finalObj.hasOwnProperty("effects")) { finalObj.effects = {}; }
			finalObj.effects.pullOutSegmentOnClick = {};
			if (effectsPullOutDiff) {
				finalObj.effects.pullOutSegmentOnClick.effect = allSettings.effects.pullOutSegmentOnClick.effect;
			}
			if (effectsPullOutSpeedDiff) {
				finalObj.effects.pullOutSegmentOnClick.speed = parseInt(allSettings.effects.pullOutSegmentOnClick.speed, 10);
			}
			if (effectsPullOutSizeDiff) {
				finalObj.effects.pullOutSegmentOnClick.size = parseInt(allSettings.effects.pullOutSegmentOnClick.size, 10);
			}
		}

		if (allSettings.effects.highlightSegmentOnMouseover != defaultSettings.effects.highlightSegmentOnMouseover) {
			if (!finalObj.hasOwnProperty("effects")) { finalObj.effects = {}; }
			finalObj.effects.highlightSegmentOnMouseover = allSettings.effects.highlightSegmentOnMouseover;

			if (allSettings.effects.highlightLuminosity != defaultSettings.effects.highlightLuminosity) {
				finalObj.effects.highlightLuminosity = parseFloat(allSettings.effects.highlightLuminosity, 10);
			}
		}

		// misc
		var miscColorBgDiff = allSettings.misc.colors.background != defaultSettings.misc.colors.background;

		var arr1 = allSettings.misc.colors.segments;
		var arr2 = defaultSettings.misc.colors.segments;
		var miscSegmentsDiff = $(arr1).not(arr2).length != 0 || $(arr2).not(arr1).length != 0;

		var miscSegmentStrokeDiff = allSettings.misc.colors.segmentStroke != defaultSettings.misc.colors.segmentStroke;

		if (miscColorBgDiff || miscSegmentsDiff || miscSegmentStrokeDiff) {
			if (!finalObj.hasOwnProperty("misc")) { finalObj.misc = {}; }
			finalObj.misc.colors = {};
			if (miscColorBgDiff) {
				finalObj.misc.colors.background = allSettings.misc.colors.background;
			}
			if (miscSegmentsDiff) {
				finalObj.misc.colors.segments = allSettings.misc.colors.segments;
			}
			if (miscSegmentStrokeDiff) {
				finalObj.misc.colors.segmentStroke = allSettings.misc.colors.segmentStroke;
			}
		}

		var canvasPaddingTopDiff = allSettings.misc.canvasPadding.top != defaultSettings.misc.canvasPadding.top;
		var canvasPaddingRightDiff = allSettings.misc.canvasPadding.right != defaultSettings.misc.canvasPadding.right;
		var canvasPaddingBottomDiff = allSettings.misc.canvasPadding.bottom != defaultSettings.misc.canvasPadding.bottom;
		var canvasPaddingLeftDiff = allSettings.misc.canvasPadding.left != defaultSettings.misc.canvasPadding.left;
		if (canvasPaddingTopDiff || canvasPaddingRightDiff || canvasPaddingBottomDiff || canvasPaddingLeftDiff) {
			if (!finalObj.hasOwnProperty("misc")) { finalObj.misc = {}; }
			finalObj.misc.canvasPadding = {};

			if (canvasPaddingTopDiff) {
				finalObj.misc.canvasPadding.top = parseInt(allSettings.misc.canvasPadding.top, 10);
			}
			if (canvasPaddingRightDiff) {
				finalObj.misc.canvasPadding.right = parseInt(allSettings.misc.canvasPadding.right, 10);
			}
			if (canvasPaddingBottomDiff) {
				finalObj.misc.canvasPadding.bottom = parseInt(allSettings.misc.canvasPadding.bottom, 10);
			}
			if (canvasPaddingTopDiff) {
				finalObj.misc.canvasPadding.left = parseInt(allSettings.misc.canvasPadding.left, 10);
			}
		}

		var pieCenterOffsetXDiff = allSettings.misc.pieCenterOffset.x != defaultSettings.misc.pieCenterOffset.x;
		var pieCenterOffsetYDiff = allSettings.misc.pieCenterOffset.y != defaultSettings.misc.pieCenterOffset.y;
		if (pieCenterOffsetXDiff || pieCenterOffsetYDiff) {
			if (!finalObj.hasOwnProperty("misc")) { finalObj.misc = {}; }
			finalObj.misc.pieCenterOffset = {};
			if (pieCenterOffsetXDiff) {
				finalObj.misc.pieCenterOffset.x = parseInt(allSettings.misc.pieCenterOffset.x, 10);
			}
			if (pieCenterOffsetYDiff) {
				finalObj.misc.pieCenterOffset.y = parseInt(allSettings.misc.pieCenterOffset.y, 10);
			}
		}

		var miscPrefixDiff = allSettings.misc.cssPrefix != defaultSettings.misc.cssPrefix;
		if (miscPrefixDiff) {
			if (!finalObj.hasOwnProperty("misc")) { finalObj.misc = {}; }
			finalObj.misc.cssPrefix = allSettings.misc.cssPrefix;
		}

		var callbackOnloadDiff = allSettings.callbacks.onload != defaultSettings.callbacks.onload;
		var callbackOnmouseoverDiff = allSettings.callbacks.onMouseoverSegment != defaultSettings.callbacks.onMouseoverSegment;
		var callbackOnmouseoutDiff = allSettings.callbacks.onMouseoutSegment != defaultSettings.callbacks.onMouseoutSegment;
		var callbackOnclickDiff = allSettings.callbacks.onClickSegment != defaultSettings.callbacks.onClickSegment;

		if (callbackOnloadDiff || callbackOnmouseoverDiff || callbackOnmouseoutDiff || callbackOnclickDiff) {
			finalObj.callbacks = {};
			if (callbackOnloadDiff) {
				finalObj.callbacks.onload = allSettings.callbacks.onload;
			}
			if (callbackOnloadDiff) {
				finalObj.callbacks.onMouseoverSegment = allSettings.callbacks.onMouseoverSegment;
			}
			if (callbackOnloadDiff) {
				finalObj.callbacks.onMouseoutSegment = allSettings.callbacks.onMouseoutSegment;
			}
			if (callbackOnloadDiff) {
				finalObj.callbacks.onClickSegment = allSettings.callbacks.onClickSegment;
			}
		}

		return finalObj;
	};

	_init();

	return {
		render: _render
	};
});