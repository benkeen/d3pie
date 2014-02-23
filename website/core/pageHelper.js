define([], function() {
	"use strict";

	// the page hierarchy. The page values map to the unique IDs for the nav items. Right now it only permits
	// two-deep nesting
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


	var _initTabs = function() {
		$("#topNav").on("click", "a", function(e) {
			window.location.hash = this.hash;
		});
	}

	/**
	 * Called once onload by app-start, it looks at the URL and figures out what page to show depending on
	 * whether there's a valid hash value.
	 * @private
	 */
	var _showStartPage = function() {
		var url = document.location.toString();

		var topLevelPage = "about";
		var secondLevelPage = null;
		if (url.match("#")) {
			var hash = url.split("#")[1];

			// klutzy, but it'll do for now
			for (var i=0; i<_pages.length; i++) {
				if (_pages[i].page === hash) {
					topLevelPage = hash;
					break;
				} else if (_pages[i].hasOwnProperty("children")) {

					var found = false;
					for (var j=0; j<_pages[i].children.length; j++) {
						if (_pages[i].children[j] === hash) {
							secondLevelPage = hash;
							found = true;
							break;
						}
					}
					if (found) {
						topLevelPage = _pages[i].page;
						break;
					}
				}
			}
		}

		$("#topNav").find("a[href=#" + topLevelPage + "]").tab("show");
		if (secondLevelPage !== null) {

		}
	};

	var _selectPage = function(page) {

	};


	return {
		initTabs: _initTabs,
		showStartPage: _showStartPage,
		selectPage: _selectPage
	};

});