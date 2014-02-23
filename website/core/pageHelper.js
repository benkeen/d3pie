/**
 * General page-level helper functions. This file's a little irksome because technically it only handles the
 * top level navigation, but since we want to be able to link to individual tabs in the generator, it actually
 * contains a list of all possible pages, then passes off work to load the individual page tab to the appropriate
 * module via pub-sub. Not great, but not too bad.
 */
define([
	"constants",
	"mediator"
], function(C, mediator) {
	"use strict";

	var _MODULE_ID = "pageHelper";

	// the page hierarchy. The page values map to the unique IDs for the nav items. Right now it only permits
	// one level deep nesting. Each page string needs to be unique across the whole system.
	var _pages = [
		{
			page: "about"
		},
		{
			page: "generator",
			children: [
				"generatorTitle", "generatorSize", "generatorData", "generatorColors", "generatorLabels",
				"generatorFooter", "generatorEffects", "generatorEvents", "generatorMisc"
			]
		},
		{
			page: "download"
		},
		{
			page: "usageTips"
		},
		{
			page: "docs"
		}
	];

	// DOM nodes
	var _$topNav;
	var _pageLoadSpeed = 200;


	/**
	 * Called once onload by app-start, it looks at the URL and figures out what page to show depending on
	 * whether there's a valid hash value.
	 * @private
	 */
	var _initPage = function() {
		_$topNav = $("#topNav");

		// set up the page navigation event handlers
		_initPageNavEventHandlers();

		var url = document.location.toString();
		var page = "about";
		if (url.match("#")) {
			page = url.split("#")[1];
		}

		_selectPage(page);
	};


	/**
	 * Our main, hideous, navigation function. This accepts a page identifier (string) listed in the _pages array
	 * above. This function validates the page string and hides/shows the appropriate page.
	 * @param page
	 * @private
	 */
	var _selectPage = function(pageCandidate) {

		// remove any hashes that may be there
		pageCandidate = pageCandidate.replace(/#/, "");

		// yuck.
		var page, subPage;
		if (_isValidPage(pageCandidate)) {
			page = _getTopLevelPage(pageCandidate);
			if (page != pageCandidate) {
				subPage = pageCandidate;
			}
		} else {
			page = "about";
		}

		var selectedNav = _$topNav.find(".active");
		var oldPage     = selectedNav.find("a").attr("href");

		// fade out the old page
		if (oldPage) {
			oldPage = oldPage.replace(/#/, "");
			selectedNav.removeClass("active");
			$("#" + oldPage).removeClass("hidden fadeIn").addClass("fadeOut");

			setTimeout(function() {
				$("#" + oldPage).addClass("hidden");

				// show the new one. Good fucking lord. Nested setTimeouts? What the gibbering fuck...
				setTimeout(function() {
					_$topNav.find("a[href=#" + page + "]").closest("li").addClass("active"); // select the tab
					$("#" + page).removeClass("hidden fadeOut").addClass("fadeIn"); // select the page
					mediator.publish(_MODULE_ID, C.EVENT.PAGE.LOAD, { page: page, oldPage: oldPage, subPage: subPage });

				}, 10);
			}, _pageLoadSpeed);
		} else {
			_$topNav.find("a[href=#" + page + "]").closest("li").addClass("active"); // select the tab
			$("#" + page).removeClass("hidden fadeOut");

			// weird, we need the timeout for the initial page load otherwise it appears immediately
			setTimeout(function() {
				$("#" + page).addClass("fadeIn");
				mediator.publish(_MODULE_ID, C.EVENT.PAGE.LOAD, { page: page, oldPage: oldPage, subPage: subPage });
			}, 10); // select the page
		}

		if (subPage) {
			window.location.hash = "#" + subPage;
		} else {
			window.location.hash = "#" + page;
		}
	};


	var _initPageNavEventHandlers = function() {
		$(document).on("click", ".selectPage", function(e) {
			e.preventDefault();
			_selectPage(this.hash);
		})
	};


	/**
	 * Looks at a page identifier string and figures out if it's a nested page, and if so returns the parent
	 * identifier - or null if not.
	 * @param page
	 * @private
	 */
	var _getTopLevelPage = function(page) {
		for (var i=0; i<_pages.length; i++) {
			if (_pages[i].page === page) {
				return page;
			} else if (_pages[i].hasOwnProperty("children")) {
				for (var j=0; j<_pages[i].children.length; j++) {
					if (_pages[i].children[j] === page) {
						return _pages[i].page;
					}
				}
			}
		}
	};

	var _isValidPage = function(page) {
		for (var i=0; i<_pages.length; i++) {
			if (_pages[i].page === page) {
				return true;
			} else if (_pages[i].hasOwnProperty("children")) {
				for (var j=0; j<_pages[i].children.length; j++) {
					if (_pages[i].children[j] === page) {
						return true;
					}
				}
			}
		}

		return false;
	}

	return {
		initPage: _initPage,
		selectPage: _selectPage
	};
});