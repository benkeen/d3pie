define([
	"constants",
	"mediator"
], function(C, mediator) {
	"use strict";

	var _MODULE_ID = "pageHelper";

	var _pages = ["about", "generator", "download", "help", "quickStart", "examples", "docs"];
	var _$topNav;
	var _currentPage = null;
	var _currentPageHash = null;


	/**
	 * Called once onload by app-start, it looks at the URL and figures out what page to show depending on
	 * whether there's a valid hash value.
	 * @private
	 */
	var _initPage = function() {
		_$topNav = $("#topNav");
		_initPageNavEventHandlers();
		_updateBodySizeClass();
		_selectPage(document.location.hash);
	};

	// this catches ALL nav clicks, not just in the main navbar
	var _initPageNavEventHandlers = function() {
		$(document).on("click", ".selectPage", function(e) {
			e.preventDefault();
			_selectPage(this.hash);
		});

		$(window).on("resize", function() {
			var width = $(window).width();
			var height = $(window).height();
			var breakPoint = _updateBodySizeClass(width);
			mediator.publish(_MODULE_ID, C.EVENT.PAGE.RESIZE, {
				width: width,
				height: height,
				breakPoint: breakPoint
			});
		});
	};

	/**
	 * This was added to get around some CSS nonsense with the homepage slider script. It adds a class to the body
	 * element that specifies the current viewport width.
	 * @private
	 */
	var _updateBodySizeClass = function(width) {
		var breakPointIndex = null;
		for (var i=0; i< C.OTHER.BREAKPOINTS.length; i++) {
			if (width >= C.OTHER.BREAKPOINTS[i]) {
				breakPointIndex = i;
			}
		}

		$("body").removeClass("size768 size992 size1200");
		var breakPoint = null;
		if (breakPointIndex !== null) {
			breakPoint = C.OTHER.BREAKPOINTS[breakPointIndex];
			$("body").addClass("size" + breakPoint);
		}
		return breakPoint;
	};

	/**
	 * Our main, hideous, navigation function. This accepts a page identifier (string) listed in the _pages array
	 * above. This function validates the page string and fade in/out the appropriate page.
	 * @param page
	 * @private
	 */
	var _selectPage = function(pageCandidate) {

		// remove any hashes that may be there
		var pageCandidateNoHash = pageCandidate.replace(/#/, "");

		var hashParts = pageCandidateNoHash.split("-");
		var page = hashParts[0];

		// check the page is valid. If not, default to the About page
		page = ($.inArray(page, _pages) !== -1) ? page : "about";
		if (pageCandidate === _currentPageHash) {
			return;
		}

		var publishData = { page: page, prevPage: _currentPage, pageHash: pageCandidateNoHash };
		if (page !== _currentPage) {

			// fade out the old page, if one was selected (not the case for first load)
			if (_currentPage) {

				_$topNav.find(".active").removeClass("active");
				$("#" + _currentPage).removeClass("hidden fadeIn").addClass("fadeOut");

				(function(cp) {
					setTimeout(function() {
						$("#" + cp).addClass("hidden").removeClass("fadeOut");

						// show the new one. Good lord. Nested setTimeouts? What the gibbering fuck...
						setTimeout(function() {
							_$topNav.find("a[href=#" + page + "]").closest("li").addClass("active"); // select the tab
							$("#" + page).removeClass("hidden fadeOut").addClass("fadeIn"); // select the page
							mediator.publish(_MODULE_ID, C.EVENT.PAGE.LOAD, publishData);
						}, 10);
					}, C.OTHER.PAGE_LOAD_SPEED);
				})(_currentPage);

			} else {
				_$topNav.find("a[href=#" + page + "]").closest("li").addClass("active"); // select the tab
				$("#" + page).removeClass("hidden fadeOut");

				// weird, we need the timeout for the initial page load otherwise it doesn't fade in
				setTimeout(function() {
					$("#" + page).addClass("fadeIn");
					mediator.publish(_MODULE_ID, C.EVENT.PAGE.LOAD, publishData);
				}, 10);
			}

		} else {
			mediator.publish(_MODULE_ID, C.EVENT.PAGE.LOAD, publishData);
		}

		window.location.hash = pageCandidate;

		// store the current page & full hash
		_currentPage = page;
		_currentPageHash = pageCandidate;
	};

	var _getDemoPieChartIndex = function(examplePies) {
		var index = 0;
		if (/#generator-start-pie\d/.test(document.location.hash)) {
			var pieChartNum = parseInt(document.location.hash.replace(/#generator-start-pie/, ""), 10);
			if ($.isNumeric(pieChartNum) && pieChartNum >= 1 && pieChartNum <= examplePies.length) {
				index = pieChartNum-1;
			}
		}
		return index;
	};

	return {
		initPage: _initPage,
		selectPage: _selectPage,
		getDemoPieChartIndex: _getDemoPieChartIndex
	};
});