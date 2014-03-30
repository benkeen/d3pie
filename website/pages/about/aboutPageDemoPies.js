define([], function() {

	var _DEMO_PIES = [
		{
			header: {
				title: {
					text:     "Distribution of love among my pets",
					color:    "#333333",
					fontSize: "20px",
					font:     "helvetica"
				},
				subtitle: {
					text:     "(proof for my wife that I really don't like her dog)",
					color:    "#333333",
					fontSize: "12px",
					font:     "helvetica"
				}
			},
			size: {
				canvasHeight: 350,
				canvasWidth: 350,
			},
			data: {
				content: [
					{ label: "Fish (cat)", value: 35 },
					{ label: "Rehan (cat)", value: 35 },
					{ label: "Mr Pleco (fish)", value: 28 },
					{ label: "Pearl (cat)", value: 15 },
					{ label: "Chairman Meow (cat)", value: 15 },
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