define([
	"constants",
	"mediator",
	"aboutPageDemoPies",
	"hbs!aboutPageTemplate"
], function(C, mediator, aboutPageDemoPies, aboutPageTemplate) {
	"use strict";

	var _MODULE_ID = "aboutPage";
	var _demoPie1, _demoPie2, _demoPie3;
	var _firstPageLoaded = false;
	var _firstPage;
	var _isRendered = false;

	var _init = function() {
		$("#about").html(aboutPageTemplate());

		var subscriptions = {};
		subscriptions[C.EVENT.PAGE.LOAD] = _onPageSelected;
		subscriptions[C.EVENT.PAGE.RESIZE] = _onPageResize;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	// a bit fussy, but unavoidable. Whenever a page changes, we need to re-draw the pies IFF (if and only if)
	// the initial page load wasn't the about page
	var _onPageSelected = function(msg) {
		if (!_firstPageLoaded) {
			_firstPage = msg.data.page;
			_firstPageLoaded = true;
			if (_firstPage === "about") {
				setTimeout(function() {
					_renderContent();
					var width = $(window).width();

					var breakPointIndex = null;
					for (var i=0; i< C.OTHER.BREAKPOINTS.length; i++) {
						if (width >= C.OTHER.BREAKPOINTS[i]) {
							breakPointIndex = i;
						}
					}
					if (breakPointIndex === null) {
						_handleViewport("small");
					}
				}, 10);
			}
			return;
		}

		if (msg.data.page === "about") {
			if (!_isRendered) {
				_renderContent();
			}
			$("#aboutPageSlides").slidesjs("refresh");
		}
	};

	var _renderContent = function() {
		$("#aboutPageSlides").slidesjs({
			width: 940,
			height: 320,
			navigation: true,
			callback: {
				// bah! God this plugin sucks. Doesn't even pass in the slide number we're going TO.
				start: function(number) {
					switch (number) {
						case 1:
							_demoPie2.redraw();
							_demoPie3.redraw();
							break;
						case 2:
							_demoPie1.redraw();
							_demoPie3.redraw();
							break;
						case 3:
							_demoPie1.redraw();
							_demoPie2.redraw();
							break;
					}
				}
			}
		});

		_demoPie1 = new d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);
		_demoPie2 = new d3pie("aboutTabDemoPie2", aboutPageDemoPies[1]);
		_demoPie3 = new d3pie("aboutTabDemoPie3", aboutPageDemoPies[2]);

		// fade in the "create similar" buttons
		setTimeout(function() {
			$("#demoPie1-createSimilarBtn,#demoPie2-createSimilarBtn,#demoPie3-createSimilarBtn").fadeIn(400);
		}, 2000);

		_isRendered = true;
	};

	var _onPageResize = function(msg) {
		if (msg.data.breakPoint === null) {
			_handleViewport("small");
		} else {
			_handleViewport("large");
		}
	};

	var _handleViewport = function(size) {
		if (size === "small") {
			//$(".aboutPageRow1").css("display", "block");
			$(".aboutPageRow2, .aboutPageRow3").css("display", "none");
		} else {
			$(".aboutPageRow2, .aboutPageRow3").css("display", "block");
		}
	};

	mediator.register(_MODULE_ID);

	return {
		init: _init
	};
});