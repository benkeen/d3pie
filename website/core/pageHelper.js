define([
	"constants",
	"mediator"
], function(C, mediator) {
	"use strict";

	var _MODULE_ID = "pageHelper";

	var _pages = ["about", "generator", "download", "howToUse", "docs"];
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
		_selectPage(document.location.hash);
	};

	// this catches ALL nav clicks, not just in the main navbar
	var _initPageNavEventHandlers = function() {
		$(document).on("click", ".selectPage", function(e) {
			e.preventDefault();
			_selectPage(this.hash);
		})
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

			// fade out the old page, if one was selected (not true for first load)
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


	return {
		initPage: _initPage,
		selectPage: _selectPage
	};
});