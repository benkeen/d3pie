define([], function() {

	var _DEMO_PIES = [

		{
			header: {
				title: {
					text:     "Lots of Programming Languages",
					color:    "#333333",
					fontSize: "20px",
					font:     "open sans"
				},
				subtitle: {
					text:     "A full pie chart to show off label collision detection and resolution.",
					color:    "#999999",
					fontSize: "10px",
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
				canvasWidth: 350,
				canvasHeight: 350,
				pieInnerRadius: "0%",
				pieOuterRadius: "55%"
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
					{ label: "Cola", value: 36344, color: "#B0EC44" }
				]
			},
			labels: {
				enableTooltips: true,
				outer: {
					format: "label",
					hideWhenLessThanPercentage: null,
					pieDistance: 20
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
					y: 20
				}
			}
		},

		{
			header: {
				title: {
					text:     "Distribution of love among my pets",
					color:    "#333333",
					fontSize: "20px"
			},
				subtitle: {
					text:     "proof for my wife that I really don't like her dog",
					color:    "#999999",
					fontSize: "12px"
				},
				location: "top-center"
			},
			size: {
				canvasHeight: 350,
				canvasWidth: 350,
				pieOuterRadius: "47%"
			},
			labels: {
				outer: {
					pieDistance: 18
				},
				inner: {
					hideWhenLessThanPercentage: 7
				},
				percentage: {
					color: "#ffffff",
					fontSize: "8px"
				}
			},
			data: {
				sortOrder: "value-asc",
				content: [
					{ label: "Fish (cat)", value: 35, color: "#444444" },
					{ label: "Rehan (cat)", value: 35, color: "#555555" },
					{ label: "Mr Pleco (fish)", value: 28, color: "#666666" },
					{ label: "Pearl (cat)", value: 15, color: "#777777" },
					{ label: "Chairman (cat)", value: 15, color: "#888888" },
					{ label: "Shroeder (cat)", value: 12, color: "#999999" },
					{ label: "Pig (cat)", value: 10, color: "#aaaaaa" },
					{ label: "Marvin (frog)", value: 8, color: "#bbbbbb" },
					{ label: "Burrito (dog) - 1%", value: 2, color: "#ff0000" }
				]
			}
		},

		{
			header: {
				title: {
					text:     "Opinions on this demo pie chart",
					color:    "#333333",
					fontSize: "20px",
					font:     "helvetica"
				},
				subtitle: {
					text:     "(proof for my wife that I really don't like her dog)",
					color:    "#999999",
					fontSize: "12px",
					font:     "helvetica"
				},
				location: "top-center"
			},
			size: {
				canvasHeight: 300,
				canvasWidth: 350,
				pieOuterRadius: "45%"
			},
			labels: {
				outer: {
					pieDistance: 20
				}
			},
			data: {
				content: [
					{ label: "Couldn't it be square?", value: 35 },
					{ label: "Rehan (cat)", value: 35 },
					{ label: "Mr Pleco (fish)", value: 28 },
					{ label: "Pearl (cat)", value: 15 },
					{ label: "Chairman (cat)", value: 15 },
					{ label: "Shroeder (cat)", value: 12 },
					{ label: "Pig (cat)", value: 10 },
					{ label: "Marvin (frog)", value: 8 },
					{ label: "Burrito (dog)", value: 1 }
				]
			}
		}

	];

	return _DEMO_PIES;
});