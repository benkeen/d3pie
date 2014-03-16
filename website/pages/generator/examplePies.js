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
			label: "Programming Languages",
			config: {
				header: {
					title: {
						text:     "Lots of Programming Languages",
						color:    "#333333",
						fontSize: "24px",
						font:     "open sans"
					},
					subtitle: {
						text:     "A full pie chart to show off label collision detection and resolution.",
						color:    "#999999",
						fontSize: "12px",
						font:     "open sans"
					},
					location: "top-center",
					titleSubtitlePadding: 9
				},
				footer: {
					text: "",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 600,
					canvasHeight: 500,
					pieInnerRadius: "0%",
					pieOuterRadius: "66%"
				},
				data: {
					sortOrder: "value-desc",
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
						hideWhenLessThanPercentage: null
					},
					inner: {
						format: "percentage",
						hideWhenLessThanPercentage: 3
					},
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "11px"
					},
					percentage: {
						color: "#ffffff",
						font: "Open sans",
						fontSize: "10px",
						decimalPlaces: 0
					},
					value: {
						color: "#adadad",
						font: "Open sans",
						fontSize: "11px"
					},
					lines: {
						enabled: true,
						style: "curved",
						length: 32,
						color: "segment"
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


		// ----------------------------------------------------------------------------------------

		{
			label: "Top 15 Fears",
			config: {
				header: {
					title: {
						text:     "Top 15 Fears",
						color:    "#333333",
						fontSize: "30px",
						font:     "courier"
					},
					subtitle: {
						text:     "What strikes the most terror in people?",
						color:    "#999999",
						fontSize: "10px",
						font:     "courier"
					},
					location: "pie-center",
					titleSubtitlePadding: 6
				},
				footer: {
					text:     "* This was curious. We're not sure why over 400 people regard Winnipeg as a Top 15 Fear.",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 650,
					canvasHeight: 500,
					pieInnerRadius: "95%",
					pieOuterRadius: "60%"
				},
				data: {
					sortOrder: "label-asc",
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
						{ label: "Planes, with/without snakes", value: 5, color: "#ae83d5" },
						{ label: "Off-by-one errors", value: 3, color: "#111111"},
						{ label: "Chickadees", value: 4, color: "#050505" },
						{ label: "A never-ending Harper Government", value: 1, color: "#646464" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label-percentage1",
						hideWhenLessThanPercentage: null
					},
					inner: {
						format: "none",
						hideWhenLessThanPercentage: null
					},
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "11"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "11",
						decimalPlaces: 0
					},
					value: {
						color: "#cccc44",
						font: "Open sans",
						fontSize: "11"
					},
					lines: {
						enabled: true,
						length: 16,
						color: "#777777"
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

		// ----------------------------------------------------------------------------------------


		{
			label: "Spousal Resentment",
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
					text: "Source: me, my room, the last 2 months.",
					color:    "#999999",
					fontSize: "11",
					font:     "open sans",
					location: "bottom-center"
				},
				size: {
					canvasWidth: 600,
					canvasHeight: 400,
					pieInnerRadius: "0%",
					pieOuterRadius: "67%"
				},
				data: {
					sortOrder: "none",
					content: [
						{ label: "When's it going to be done?", value: 8, color: "#000000" },
						{ label: "Bennnnn!", value: 5, color: "#BDC97A" },
						{ label: "Oh, god.", value: 2, color: "#DDE32D"},
						{ label: "But it's Friday night!", value: 3, color: "#39993B" },
						{ label: "Again?", value: 2, color: "#29263D" },
						{ label: "I'm considering an affair.", value: 1, color: "#8BAFBD" },
						{ label: "[baleful stare]", value: 3, color: "#688A51" }
					]
				},
				labels: {
					enableTooltips: true,
					outer: {
						format: "label",
						hideWhenLessThanPercentage: null
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
			label: "The Sun",
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
						color:    "#ff0000",
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
					canvasWidth: 650,
					canvasHeight: 500,
					pieInnerRadius: "0%",
					pieOuterRadius: "66%"
				},
				data: {
					sortOrder: "label-desc",
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
						hideWhenLessThanPercentage: null
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