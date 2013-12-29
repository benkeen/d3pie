require.config({
	baseUrl: "/d3-pie-charts/",
	paths: {

		// core stuff
		text: "js/libs/text",
		hbs: "js/libs/hbs",
		handlebars: "js/libs/handlebars.dev",
		handlebarsHelpers: "js/handlebarsHelpers",
		constants: "js/constants",
		pageHelper: "js/pageHelper",

		// main pages
		aboutPage: "js/aboutPage",
		generatorPage: "js/generatorPage",
		downloadPage: "js/downloadPage",
		documentationPage: "js/documentationPage",

		// templates
		sidebarTemplate: "templates/sidebar.hbs",
		examplePiesTemplate: "templates/examplePies.hbs",
		generatorTabsTemplate: "templates/generatorTabs.hbs",
		aboutPageTemplate: "templates/aboutPage.hbs",
		generatorPageTemplate: "templates/generatorPage.hbs",
		downloadPageTemplate: "templates/downloadPage.hbs",
		documentationPageTemplate: "templates/documentationPage.hbs",

		pieChartGenerator: "js/pieChartGenerator",
		generatorTabs: "js/generatorTabs"
	}
});