require.config({
	baseUrl: "<%=baseUrl%>",

	paths: {
		handlebars: "<%=handlebarsLib%>",
		birds: "pages/generator/birds",

		<%=moduleStr%>
	}
});