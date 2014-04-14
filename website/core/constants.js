define([], function() {

	var C = {
		VERSION: "0.1.0",
		MINIFIED: false,
		DEBUG: false
	};

	C.PALETTES = [
		{
			name: "Greens",
			colors: ["#92dd98", "#68ca6f", "#58b65e", "#4ca551", "#3f8450", "#296137", "#16481a", "#0a370e", "#062708", "#000000"]
		}
	];

	C.EVENT = {
		DEMO_PIE: {
			LOAD: 'demo-pie-load',
			RENDER: {
				NO_ANIMATION: 'demo-pie-render-no-animation',
				WITH_ANIMATION: 'demo-pie-render-with-animation',
				UPDATE_PROP: 'demo-pie-render-update-prop'
			},
			DATA_CHANGE: 'demo-pie-data-change',
			EXAMPLE_CHANGE: 'demo-pie-example-change',
			SELECT_SEGMENT: 'demo-pie-select-segment',
			SEND_DATA: 'demo-pie-send-data'
		},
		PAGE: {
			LOAD: 'load-page',
			RESIZE: 'page-resize'
		}
	};

	C.OTHER = {
		PAGE_LOAD_SPEED: 200
	};

	return C;
});