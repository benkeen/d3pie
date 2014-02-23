/**
 * General page-level helper functions. This file's a little irksome because technically it only handles the
 * top level navigation, but since we want to be able to link to individual tabs in the generator, it actually
 * contains a list of all possible pages, then passes off work to load the individual page tab to the appropriate
 * module via pub-sub. Not great, but not too bad.
 */
define([], function() {
	"use strict";

	// the page hierarchy. The page values map to the unique IDs for the nav items. Right now it only permits
	// one level deep nesting. Each page string needs to be unique across the whole system.
	var _pages = [
		{
			page: "about"
		},
		{
			page: "generator",
			children: ["title", "size", "data", "colors", "labels", "footer", "effects", "events", "misc" ]
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
	 * Our main navigation function. This accepts a page identifier (string) listed in the _pages array above. This
	 * function validates the page string and hides/shows the appropriate page.
	 * @param page
	 * @private
	 */
	var _selectPage = function(page) {

		// remove any hashes that may be there
		page = page.replace("#", "");

		var oldTopLevelPage = _$topNav.find("a.active").attr("href");
		console.log("oldTopLevelPage: ", oldTopLevelPage);

		// fade out the old page


		_$topNav.find("a[href=#" + page + "]").closest("li").addClass("active");

		// update the URL field
		//window.location.hash = this.hash;

		if (secondLevelPage !== null) {

		}

		// publish an event that we're loading this page. Different pages may want to know about it

	};

	var _initPageNavEventHandlers = function() {
		$(document).on("click", ".selectPage", function(e) {
			_selectPage(this.hash);
		})
	};


	/**
	 * Looks at a page identifier string and figures out if it's a nested page, and if so returns the parent
	 * identifier - or null if not.
	 * @param page
	 * @private
	 */
	var _getParentPage = function(page) {

		var parentPage = null;

		// klutzy, but it'll do for now
		for (var i=0; i<_pages.length; i++) {
			if (_pages[i].page === page) {
				parentPage = page;
				break;
			} else if (_pages[i].hasOwnProperty("children")) {
				var found = false;
				for (var j=0; j<_pages[i].children.length; j++) {
					if (_pages[i].children[j] === page) {
						parentPage = page;
						found = true;
						break;
					}
				}
				if (found) {
					break;
				}
			}
		}

		return parentPage;
	};


	return {
		initPage: _initPage,
		selectPage: _selectPage
	};
});