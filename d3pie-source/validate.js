// --------- validate.js -----------
var validate = {

	// called whenever a new pie chart is created
	initialCheck: function(element, options) {

		// confirm d3 is available [check minimum version]
		if (!window.d3 || !window.d3.hasOwnProperty("version")) {
			console.error("d3pie error: d3 is not available");
			return;
		}

		// confirm element is either a DOM element or a valid string for a DOM element
		if (typeof element === "string") {
			var domElement = document.getElementById(element);
			if (domElement === null) {
				console.error("d3pie error: a DOM element with ID not found: ", element);
				return;
			}
		} else {
			if (!(element instanceof HTMLElement)) {
				console.error("d3pie error: the first d3pie() param must be a valid DOM element (not jQuery) or a ID string.");
				return;
			}
		}
	}
};