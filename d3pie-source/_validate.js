// --------- validate.js -----------
var validate = {

	// called whenever a new pie chart is created
	initialCheck: function() {

		// confirm d3 is available [check minimum version]
		if (!window.d3 || !window.d3.hasOwnProperty("version")) {
			console.error("d3pie error: d3 is not available");
			return false;
		}

		// confirm element is either a DOM element or a valid string for a DOM element
		if (typeof this.element === "string") {
			var domElement = document.getElementById(this.element);
			if (domElement === null) {
				console.error("d3pie error: a DOM element with ID not found: ", this.element);
				return false;
			}
		} else {
			if (!(this.element instanceof HTMLElement)) {
				console.error("d3pie error: the first d3pie() param must be a valid DOM element (not jQuery) or a ID string.");
				return false;
			}
		}

		// confirm some data has been supplied
		if (!this.options.data.hasOwnProperty("content")) {
			console.error("d3pie error: invalid config structure: missing data.content property.");
			return false;
		}
		if (!$.isArray(this.options.data.content) || this.options.data.content.length === 0) {
			console.error("d3pie error: no data supplied.");
			return false;
		}

		// confirm the CSS prefix is valid. It has to start with a-Z and contain nothing but a-Z0-9_-
		// TODO test
		if (this.options.misc.cssPrefix !== null && !(/[a-zA-Z][a-zA-Z0-9_-]$/.test(this.options.misc.cssPrefix))) {
			console.error("d3pie error: invalid options.misc.cssPrefix");
			return false;
		}

		return true;
	}
};