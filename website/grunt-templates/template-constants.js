define([], function() {

	var C = {
		VERSION: "<%=VERSION%>",
		MINIMIZED: <%=MINIMIZED%>,
		DEBUG: <%=DEBUG%>
	};

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
		PAGE_LOAD_SPEED: 200,
		BREAKPOINTS: [768, 992, 1200]
	};

	return C;
});