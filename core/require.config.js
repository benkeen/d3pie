require.config({
	baseUrl: "/d3pie/",
	paths: {

		// core stuff
		text: "core/libs/text",
		hbs: "core/libs/hbs",
		handlebars: "core/libs/handlebars.dev",
		handlebarsHelpers: "core/handlebarsHelpers",
		constants: "core/constants",
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
		pieChartGenerator: "pages/generator/pieChartGenerator",
		sidebarTemplate: "pages/generator/sidebar.hbs",
		examplePiesTemplate: "pages/generator/examplePies.hbs",
		generatorTabsTemplate: "pages/generator/generatorTabs.hbs",
		generatorPageTemplate: "pages/generator/generatorPage.hbs"
	}
});