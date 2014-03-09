/**
 *  --------- defaultSettings.js -----------
 *
 * Contains the out-the-box settings for the script. Any of these settings that aren't explicitly overridden for the
 * d3pie instance will inherit from these.
 */
var _defaultSettings = {
	header: {
		title: {
			color:    "#333333",
			fontSize: "14px",
			font:     "helvetica"
		},
		subtitle: {
			color:    "#333333",
			fontSize: "14px",
			font:     "helvetica"
		},
		location: "top-left"
	},
	footer: {
		text: ""
	},
	size: {
		canvasHeight: 500,
		canvasWidth: 500,
		pieInnerRadius: "100%",
		pieOuterRadius: null
	},
	labels: {
		enableTooltips: true,
		inner: {
			format: "percentage",
			hideWhenLessThanPercentage: null
		},
		outer: {
			format: "label",
			hideWhenLessThanPercentage: null
		},
		mainLabel: {
			color: "#333333",
			font: "Open sans",
			fontSize: "8"
		},
		percentage: {
			color: "#999999",
			font: "Open sans",
			fontSize: "8"
		},
		value: {
			color: "#cccc44",
			font: "Open sans",
			fontSize: "8"
		},
		lines: {
			enabled: true,
			style: "curved",
			length: 16,
			color: "segment" // "segment" or a hex color
		}
	},
	styles: {
		backgroundColor: null,
		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"]
	},
	effects: {
		load: {
			effect: "default", // none / default
			speed: 1000
		},
		pullOutSegmentOnClick: {
			effect: "linear", // none / linear / bounce /
			speed: 400
		},
		highlightSegmentOnMouseover: false,
		labelFadeInTime: 400
	},
	tooltips: {
		enable: false
	},
	misc: {
		cssPrefix: "auto", // needed for?
		dataSortOrder: "none", // none, value-asc, value-desc, label-asc, label-desc, random [urgh! Wrong location]
		canvasPadding: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		titleSubtitlePadding: 5, // the padding between the title and subtitle
		footerPiePadding: 0
	},
	callbacks: {
		onload: null,
		onMouseoverSegment: null,
		onMouseoutSegment: null,
		onClickSegment: null
	}
};
