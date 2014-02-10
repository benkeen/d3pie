require.config({
	baseUrl: "website/",
	paths: {

		// library stuff
		text: "libs/text",
		hbs: "libs/hbs",
		handlebars: "libs/handlebars.dev",

		// core stuff
		handlebarsHelpers: "core/handlebarsHelpers",
		constants: "core/constants",
		mediator: "core/mediator",
		utils: "core/utils",
		pageHelper: "core/pageHelper",

		// About page
		aboutPage: "pages/about/aboutPage",
		aboutPageTemplate: "pages/about/aboutPage.hbs",

		// Documentation page
		documentationPage: "pages/documentation/documentationPage",
		documentationPageTemplate: "pages/documentation/documentationPage.hbs",

		// Download page
		downloadPage: "pages/download/downloadPage",
		downloadPageTemplate: "pages/download/downloadPage.hbs",

		// Generator page
		generatorPage: "pages/generator/generatorPage",
		generatorTabs: "pages/generator/generatorTabs",
		examplePies: "pages/generator/examplePies",
		examplePiesTemplate: "pages/generator/examplePies.hbs",
		generatorPageTemplate: "pages/generator/generatorPage.hbs",


		// --- tabs ---
		titleTab: "pages/generator/tabs/title/tabTitle",
		titleTabTemplate: "pages/generator/tabs/title/tabTitleTemplate.hbs",

		sizeTab: "pages/generator/tabs/size/tabSize",
		sizeTabTemplate: "pages/generator/tabs/size/tabSizeTemplate.hbs",

		miscTab: "pages/generator/tabs/misc/tabMisc",
		miscTabTemplate: "pages/generator/tabs/misc/tabMiscTemplate.hbs",

		dataTab: "pages/generator/tabs/data/tabData",
		dataTabTemplate: "pages/generator/tabs/data/tabDataTemplate.hbs",

		labelsTab: "pages/generator/tabs/labels/tabLabels",
		labelsTabTemplate: "pages/generator/tabs/labels/tabLabelsTemplate.hbs",

		footerTab: "pages/generator/tabs/footer/tabFooter",
		footerTabTemplate: "pages/generator/tabs/footer/tabFooterTemplate.hbs",

		colorsTab: "pages/generator/tabs/colors/tabColors",
		colorsTabTemplate: "pages/generator/tabs/colors/tabColorsTemplate.hbs",

		effectsTab: "pages/generator/tabs/effects/tabEffects",
		effectsTabTemplate: "pages/generator/tabs/effects/tabEffectsTemplate.hbs",

		eventsTab: "pages/generator/tabs/events/tabEvents",
		eventsTabTemplate: "pages/generator/tabs/events/tabEventsTemplate.hbs",

		// misc
		birds: "pages/generator/birds"
	}
});