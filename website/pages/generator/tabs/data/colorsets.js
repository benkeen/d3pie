define([], function() {
	"use strict";

	var _COLORSETS = {

		// 10 items
		small: [
			{ label: "Greys", colors: ["#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#afafaf", "#bcbcbc", "#d8d8d8"] },
			{ label: "Blues", colors: ["#00047c", "#2f3399", "#2f52aa", "#2e59c9", "#4d70cc", "#738eef", "#77a0dd", "#9db5f2", "#bccff2", "#d7e5f7"] },
			{ label: "Greens", colors: ["#043a00", "#104904", "#155d07", "#217f0e", "#2ea217", "#41cb29", "#58ea3e", "#9ff990", "#bbfdb0", "#d3fdcb"] },
			{ label: "Palette 1 - bold", colors: ["#0066cc", "#003366", "#336600", "#669966", "#990000", "#cc6600", "#66cc33", "#cc6699", "#ffff33", "#9933ff" ] },
			{ label: "Palette 2 - light pastel", colors: ["#ccb2b2", "#ccc8b2", "#c4ccb2", "#b6ccb2", "#b2ccbc", "#b2ccc9", "#b2c3cc", "#b2b8cc", "#b7b2cc", "#c3b2cc" ] },
			{ label: "Palette 3 - medium pastel", colors: ["#7e3939", "#7e6539", "#7c7e39", "#597e39", "#397e46", "#397e6a", "#396a7e", "#39517e", "#4e397e", "#7a397e" ] },
			{ label: "Palette 4 - dark pastel", colors: ["#4e3a3a", "#4a4e3a", "#414e3a", "#3a4e43", "#3a4c4e", "#3a3f4e", "#3c3a4e", "#443a4e", "#4e3a4d", "#4e3a42" ] }
		],

		// 20 items
		medium: [
			{
				label: "Blues",
				colors: [
					"#000924", "#010d2f", "#021345", "#031a5d", "#042174", "#052480", "#082d97", "#0a32a3", "#1341c3", "#1746ce",
					"#2354e2", "#275aea", "#386af9", "#4473fb", "#5b84fa", "#678efb", "#81a1fa", "#90abfb", "#b2c6ff", "#d4dffd"
				]
			},
			{
				label: "Greens",
				colors: [
					"#062600", "#093201", "#0b3c02", "#0e4603", "#104904", "#155d07", "#1b6f0a", "#217f0e", "#279212", "#2ea217",
					"#36b520", "#41cb29", "#4cdc33", "#58ea3e", "#73fa5b", "#89f876", "#9ff990", "#bbfdb0", "#d3fdcb", "#dfffdc",
					"#e9fde6"
				]
			},
			{
				label: "Palette 2 - light pastel",
				colors: [
					"#ccb2b2", "#ccb9b2", "#ccc2b2", "#cccbb2", "#c7ccb2", "#bfccb2", "#b7ccb2", "#b2ccb7", "#b2ccbe", "#b2ccc6",
					"#b2cacc", "#b2c4cc", "#b2bbcc", "#b2b4cc", "#b8b2cc", "#beb2cc", "#c6b2cc", "#ccb2cb", "#ccb2c3", "#ccb2bd"
				]
			},
			{
				label: "Palette 3 - medium pastel",
				colors: [
					"#7e3939", "#7e5139", "#7e6839", "#787e39", "#607e39", "#4c7e39", "#397e43", "#397e5d", "#397e73", "#396d7e",
					"#395d7e", "#394b7e", "#394b7e", "#46397e", "#55397e", "#63397e", "#77397e", "#7e3972", "#7e3960", "#7e394b"
				]
			},
			{ label: "Palette 4 - dark pastel", colors: [] }
		],

		// 30 items
		large: [
			{
				label: "Blues",
				colors: [
					"#000924", "#010d2f", "#01103a", "#021345", "#031a5d", "#031d68", "#042174", "#052480", "#06298c",
					"#082d97", "#0a32a3", "#0d39b8", "#1341c3", "#1746ce", "#1b4cd8", "#2354e2", "#275aea", "#2f62f2",
					"#386af9", "#4473fb", "#507cfb", "#5b84fa", "#678efb", "#7598fb", "#81a1fa", "#90abfb", "#9eb6fc",
					"#b2c6ff", "#c2d1fc", "#d4dffd"
				]
			},
			{
				label: "Reds",
				colors: [
					"#3b0400", "#470601", "#510701", "#5c0802", "#670902", "#710b03", "#7a0c03", "#840e05", "#8f1006",
					"#991107", "#a51308", "#ae1509", "#b6160a", "#bf180b", "#cb1b0e", "#d41d0f", "#e22214", "#ed2617",
					"#f82f20", "#fe4133", "#fd5143", "#fd6155", "#fe7167", "#fd847b", "#fd958d", "#fca099", "#fdb0aa",
					"#fcbfbb", "#fdceca", "#fde1df"
				]
			}
		]
	};

	return _COLORSETS;
});