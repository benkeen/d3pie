define([
	"constants",
	"mediator",
	"utils",
	"handlebars",
	"hbs!colorsTabTemplate",
	"hbs!colorItemPartial"
], function(C, mediator, utils, Handlebars, colorsTabTemplate, colorItemPartial) {
	"use strict";

	var _MODULE_ID = "colorsTab";
	var _proofEnabled = false;
	var _proofLoading = true;
	var _canvasHeight = null;
	var _canvasWidth = null;


	/**
	 * Self-called. See end of file. [urgh. Need to formally structure this a bit better].
	 */
	var _init = function() {
		mediator.register(_MODULE_ID);
		Handlebars.registerPartial("color-item", colorItemPartial);

		var subscriptions = {};
		subscriptions[C.EVENT.DEMO_PIE.DATA_CHANGE] = _onDataChange;
		subscriptions[C.EVENT.DEMO_PIE.EXAMPLE_CHANGE] = _onExampleChange;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	/**
	 * Listen for data changes so we can keep track of the current canvas size.
	 * @param msg
	 * @private
	 */
	var _onDataChange = function(msg) {
		_canvasWidth = msg.data.config.size.canvasWidth;
		_canvasHeight = msg.data.config.size.canvasHeight;
	};

	var _onExampleChange = function() {
		if (_proofEnabled) {
			_stop();
		}
	};

	var _render = function(tabEl, config) {
		$(tabEl).html(colorsTabTemplate({ config: config }));
		_canvasWidth = config.size.canvasWidth;
		_canvasHeight = config.size.canvasHeight;

		$("#deleteColorZone").sortable({
			connectWith: "#segmentColors",
			over: function() {
				console.log("....");
			}
		});

		$("#addColorLink").on("click", function(e) {
			e.preventDefault();
		});

		utils.addColorpicker("backgroundColor");
		$(".segmentColor").colorpicker().on("changeColor", function(e) {
			$(e.target).css("background-color", e.color.toHex());
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$("#segmentColors").sortable({
			handle: ".handle",
			connectWith: "#deleteColorZone",
			update: function() {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});
		$("input[name=backgroundColorType]").on("change", function() {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$("#backgroundColor").on("focus", function() {
			$("#backgroundColor2")[0].checked = true;
			$("#backgroundColorGroup").colorpicker("show");
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
		});

		$("#addColor").on("click", function(e) {
			e.preventDefault();
			$("#segmentColors").append(colorItemPartial({
				color: "#000000"
			}));
		});

		if (Modernizr.webgl) {
			$("#transparencyProof").removeClass("hidden").on("click", _toggleProof);
		}
	};

	var _getTabData = function() {
		var colors = [];

		var colorElements = $("#segmentColors").find("span.color");
		for (var i=0; i<colorElements.length; i++) {
			colors.push(_rgb2hex($(colorElements[i]).css("background-color")));
		}

		var backgroundColor = null;
		var selectedBackgroundColorType = $("input[name=backgroundColorType]:checked").val();
		if (selectedBackgroundColorType === "solid") {
			backgroundColor = $("#backgroundColor").val();
		}

		return {
			backgroundColor: backgroundColor,
			colors: colors
		};
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

	var _toggleProof = function() {
		if ($("#three_js").length === 0) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "website/libs/three.js";
			script.id = "three_js";
			document.body.appendChild(script);
		}

		// label-danger
		if (_proofEnabled) {
			_stop();
		} else {
			$("#transparencyProof").removeClass("label-default").addClass("label-danger").html("Alright, stop the birds!");

			var interval = setTimeout(function() {
				if ($("#three_js").length !== 0) {
					clearInterval(interval);
					require(["birds"], function(birds) {
						birds.init(_canvasWidth, _canvasHeight);
						birds.start();
						_proofEnabled = true;
						_proofLoading = false;
					});
				}
			}, 50);
		}
	};

	var _stop = function() {
		$("#transparencyProof").removeClass("label-danger").addClass("label-default").html("Prove it again.");
		require(["birds"], function(birds) {
			birds.stop();
		});
		_proofEnabled = false;
	};

	_init();


	return {
		render: _render,
		getTabData: _getTabData
	};
});