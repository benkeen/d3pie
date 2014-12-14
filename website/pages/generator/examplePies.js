define([], function() {
	"use strict";


	/**
	 * This file contains all the pie chart configurations that show up in the "Examples" dropdown on the
	 * generator page. Note: these configurations are *exhaustive*: they define every possible setting, even specifying
	 * the defaults. When using the actual script, people will only have to define those settings they actually need,
	 * so the "generate code" option will show a subset of all this.
	 */
	var EXAMPLE_PIES = [

		{
			label: "Full pie chart",
			showCanvasOutline: true,
			config: {
				header: {
					title: {
						text:     "Lots of Programming Languages",
						color:    "#333333",
						fontSize: 24,
						font:     "open sans"
					},
					subtitle: {
						text:     "A full pie chart to show off label collision detection and resolution.",
						color:    "#999999",
						fontSize: 12,
						font:     "open sans"
					},
					location: "top-center",
					titleSubtitlePadding: 9
				},
				footer: {
					text: "",
					color:    "#999999",
					fontSize: 10,
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 590,
					canvasHeight: 500,
					pieInnerRadius: "0%",
					pieOuterRadius: "90%"
				},
				data: {
					sortOrder: "value-desc",
					smallSegmentGrouping: {
						enabled: false,
						value: 1,
						valueType: "percentage",
						label: "Other",
						color: "#cccccc"
					},
					content: [
						{ label: "JavaScript", value: 264131, color: "#2484c1" },
						{ label: "Ruby", value: 218812, color: "#0c6197" },
						{ label: "Java", value: 157618, color: "#4daa4b" },
						{ label: "PHP", value: 114384, color: "#90c469" },
						{ label: "Python", value: 95002, color: "#daca61" },
						{ label: "C+", value: 78327, color: "#e4a14b" },
						{ label: "C", value: 67706, color: "#e98125" },
						{ label: "Objective-C", value: 36344, color: "#cb2121" },
						{ label: "Shell", value: 28561, color: "#830909" },
						{ label: "Cobol", value: 24131, color: "#923e99" },
						{ label: "C#", value: 100, color: "#ae83d5" },
						{ label: "Coldfusion", value: 68, color: "#BF273E" },
						{ label: "Fortran", value: 218812, color: "#CE2AEB" },
						{ label: "Coffeescript", value: 157618, color: "#BCA44A" },
						{ label: "Node", value: 114384, color: "#618D1B" },
						{ label: "Basic", value: 95002, color: "#1EE67B" },
						{ label: "Cola", value: 36344, color: "#B0EC44" },
						{ label: "Perl", value: 32170, color: "#A4A0C9" },
						{ label: "Dart", value: 28561, color: "#322849" },
						{ label: "Go", value: 264131, color: "#86F71A" },
						{ label: "Groovy", value: 218812, color: "#D1C87F" },
						{ label: "Processing", value: 157618, color: "#7D9058" },
						{ label: "Smalltalk", value: 114384, color: "#44B9B0" },
						{ label: "Scala", value: 95002, color: "#7C37C0" },
						{ label: "Visual Basic", value: 78327, color: "#CC9FB1" },
						{ label: "Scheme", value: 67706, color: "#E65414" },
						{ label: "Rust", value: 36344, color: "#8B6834" },
						{ label: "FoxPro", value: 32170, color: "#248838" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label",
						hideWhenLessThanPercentage: null,
						pieDistance: 32
					},
					inner: {
						format: "percentage",
						hideWhenLessThanPercentage: 3
					},
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: 11
					},
					percentage: {
						color: "#ffffff",
						font: "Open sans",
						fontSize: 10,
						decimalPlaces: 0
					},
					value: {
						color: "#adadad",
						font: "Open sans",
						fontSize: 11
					},
					lines: {
						enabled: true,
						style: "curved",
						length: 32,
						color: "segment"
					},
					truncation: {
						enabled: true,
						length: 30
					}
				},
				tooltips: {
					enabled: false,
					type: "placeholder",
					string: "{label}: {value}, {percentage}%",
					styles: {
						fadeInSpeed: 250,
						backgroundColor: "#000000",
						backgroundOpacity: 0.5,
						color: "#efefef",
						borderRadius: 2,
						font: "arial",
						fontSize: 10,
						padding: 4
					}
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce
						speed: 400,
						size: 8
					},
					highlightSegmentOnMouseover: true,
					highlightLuminosity: -0.5
				},
				misc: {
					colors: {
						background: null,
						segmentStroke: "#ffffff"
					},
					gradient: {
						enabled: true,
						percentage: 100,
						color: "#000000"
					},
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					pieCenterOffset: {
						x: 0,
						y: 0
					}
				}
			}
		},


		// ----------------------------------------------------------------------------------------

		{
			label: "Donut chart",
			showCanvasOutline: true,
			config: {
				header: {
					title: {
						text:     "Top 15 Fears",
						color:    "#333333",
						fontSize: 34,
						font:     "courier"
					},
					subtitle: {
						text:     "What strikes the most terror in people?",
						color:    "#999999",
						fontSize: 10,
						font:     "courier"
					},
					location: "pie-center",
					titleSubtitlePadding: 10
				},
				footer: {
					text:     "* This was curious. We're not sure why over several people regard Winnipeg as a Top 15 Fear.",
					color:    "#999999",
					fontSize: 10,
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 590,
					canvasHeight: 500,
					pieInnerRadius: "95%",
					pieOuterRadius: "70%"
				},
				data: {
					sortOrder: "label-desc",
					smallSegmentGrouping: {
						enabled: false,
						value: 1,
						valueType: "percentage",
						label: "Other",
						color: "#cccccc"
					},
					content: [
						{ label: "Spiders", value: 2, color: "#333333" },
						{ label: "Mother-in-laws", value: 10, color: "#444444" },
						{ label: "Sharks", value: 8, color: "#555555" },
						{ label: "Alien invasion", value: 8, color: "#666666" },
						{ label: "Learning Objective-C", value: 5, color: "#777777" },
						{ label: "Public speaking", value: 3, color: "#888888" },
						{ label: "Donald Rumsfeld", value: 4, color: "#999999" },
						{ label: "The Zombie Apocalypse", value: 4, color: "#cb2121" },
						{ label: "The City of Winnipeg *", value: 3, color: "#830909" },
						{ label: "IE 6", value: 2, color: "#923e99" },
						{ label: "Planes with/out snakes", value: 5, color: "#ae83d5" },
						{ label: "Off-by-one errors", value: 3, color: "#111111"},
						{ label: "Chickadees", value: 4, color: "#050505" },
						{ label: "A never-ending Harper Government", value: 1, color: "#646464" },
						{ label: "Canada", value: 4, color: "#747474" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label-percentage1",
						hideWhenLessThanPercentage: null,
						pieDistance: 20
					},
					inner: {
						format: "none",
						hideWhenLessThanPercentage: null
					},
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: 11
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: 11,
						decimalPlaces: 0
					},
					value: {
						color: "#cccc44",
						font: "Open sans",
						fontSize: 11
					},
					lines: {
						enabled: true,
						length: 16,
						color: "#777777"
					},
					truncation: {
						enabled: true,
						length: 30
					}
				},
				tooltips: {
					enabled: false,
					type: "placeholder",
					string: "{label}: {value}, {percentage}%",
					styles: {
						fadeInSpeed: 250,
						backgroundColor: "#000000",
						backgroundOpacity: 0.5,
						color: "#efefef",
						borderRadius: 2,
						font: "arial",
						fontSize: 10,
						padding: 4
					}
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce /
						speed: 400,
						size: 8
					},
					highlightSegmentOnMouseover: true,
					highlightLuminosity: -0.2
				},
				misc: {
					colors: {
						background: null,
						segmentStroke: "#000000"
					},
					gradient: {
						enabled: false,
						percentage: 95,
						color: "#000000"
					},
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					pieCenterOffset: {
						x: 0,
						y: 0
					}
				}
			}
		},

		// ----------------------------------------------------------------------------------------


		{
			label: "Standard pie chart, small data set",
			showCanvasOutline: true,
			config: {
				header: {
					title: {
						text:     "Spousal Resentment",
						color:    "#333333",
						fontSize: "22",
						font:     "verdana"
					},
					subtitle: {
						text:     "Comments my wife has made when I tell her I'm working on this script instead of doing something \"fun\".",
						color:    "#999999",
						fontSize: "10",
						font:     "verdana"
					},
					location: "top-center",
					titleSubtitlePadding: 12
				},
				footer: {
					text: "Source: me, my room, the last couple of months.",
					color:    "#999999",
					fontSize: "11",
					font:     "open sans",
					location: "bottom-center"
				},
				size: {
					canvasWidth: 590,
					canvasHeight: 400,
					pieInnerRadius: "0%",
					pieOuterRadius: "88%"
				},
				data: {
					sortOrder: "none",
					smallSegmentGrouping: {
						enabled: false,
						value: 1,
						valueType: "percentage",
						label: "Other",
						color: "#cccccc"
					},
					content: [
						{ label: "When's it going to be done?", value: 8, color: "#7e3838" },
						{ label: "Bennnnn!", value: 5, color: "#7e6538" },
						{ label: "Oh, god.", value: 2, color: "#7c7e38" },
						{ label: "But it's Friday night!", value: 3, color: "#587e38" },
						{ label: "Again?", value: 2, color: "#387e45" },
						{ label: "I'm considering an affair.", value: 1, color: "#387e6a" },
						{ label: "[baleful stare]", value: 3, color: "#386a7e" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label",
						hideWhenLessThanPercentage: null,
						pieDistance: 32
					},
					inner: {
						format: "value",
						hideWhenLessThanPercentage: null
					},
					mainLabel: {
						color: "#333333",
						font: "verdana",
						fontSize: "10"
					},
					percentage: {
						color: "#e1e1e1",
						font: "verdana",
						fontSize: "10",
						decimalPlaces: 0
					},
					value: {
						color: "#e1e1e1",
						font: "verdana",
						fontSize: "10"
					},
					lines: {
						enabled: true,
						style: "curved",
						length: 16,
						color: "#cccccc"
					},
					truncation: {
						enabled: true,
						length: 30
					}
				},
				tooltips: {
					enabled: false,
					type: "placeholder",
					string: "{label}: {value}, {percentage}%",
					styles: {
						fadeInSpeed: 250,
						backgroundColor: "#000000",
						backgroundOpacity: 0.5,
						color: "#efefef",
						borderRadius: 2,
						font: "arial",
						fontSize: 10,
						padding: 4
					}
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce /
						speed: 400,
						size: 8
					},
					highlightSegmentOnMouseover: true,
					highlightLuminosity: -0.2
				},
				misc: {
					colors: {
						background: null,
						segmentStroke: "#ffffff"
					},
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					pieCenterOffset: {
						x: 0,
						y: 0
					}
				}
			}
		},

		{
			label: "Inverted colors",
			showCanvasOutline: false,
			config: {
				header: {
					title: {
						text:     "The Sun",
						color:    "#000000",
						fontSize: "50px",
						font:     "Helvetica"
					},
					subtitle: {
						text:     "Chemical composition",
						color:    "#b80000",
						fontSize: "14px",
						font:     "Helvetica"
					},
					location: "pie-center",
					titleSubtitlePadding: 9
				},
				footer: {
					text: "Source: http://en.wikipedia.org/wiki/The_sun",
					color:    "#666666",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 590,
					canvasHeight: 500,
					pieInnerRadius: "0%",
					pieOuterRadius: "100%"
				},
				data: {
					sortOrder: "label-desc",
					smallSegmentGrouping: {
						enabled: false,
						value: 1,
						valueType: "percentage",
						label: "Other",
						color: "#cccccc"
					},
					content: [
						{ label: "Hydrogen", value: 74.9, color: "#fdd000" },
						{ label: "Helium", value: 23.8, color: "#ccab12" },
						{ label: "Oxygen", value: 1, color: "#dd8d11" },
						{ label: "Carbon", value: 0.3, color: "#999999"  },
						{ label: "Neon", value: 0.2, color: "#999999" },
						{ label: "Iron", value: 0.2, color: "#999999" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label-percentage1",
						hideWhenLessThanPercentage: null,
						pieDistance: 32
					},
					inner: {
						format: "none",
						hideWhenLessThanPercentage: null
					},
					mainLabel: {
						color: "#bbbbbb",
						font: "Open sans",
						fontSize: "11px"
					},
					value: {
						color: "#e1e1e1",
						font: "verdana",
						fontSize: "10"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "11px",
						decimalPlaces: 5
					},
					lines: {
						enabled: true,
						length: 32,
						color: "segment"
					},
					truncation: {
						enabled: true,
						length: 30
					}
				},
				tooltips: {
					enabled: false,
					type: "placeholder",
					string: "{label}: {value}, {percentage}%",
					styles: {
						fadeInSpeed: 250,
						backgroundColor: "#000000",
						backgroundOpacity: 0.5,
						color: "#efefef",
						borderRadius: 2,
						font: "arial",
						fontSize: 10,
						padding: 4
					}
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce
						speed: 400,
						size: 8
					},
					highlightSegmentOnMouseover: true,
					highlightLuminosity: -0.2
				},
				misc: {
					colors: {
						background: "#000000",
						segmentStroke: "#222222"
					},
					gradient: {
						enabled: true,
						percentage: 100,
						color: "#ff0000"
					},
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					pieCenterOffset: {
						x: 0,
						y: 15
					}
				}
			}
		}
	];

	return EXAMPLE_PIES;
});
