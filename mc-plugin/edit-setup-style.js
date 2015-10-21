MapControl.register({
	name : "edit-setup-style",
	init : function(options) {

		/*
		 * symbolizers
		 * @see http://docs.openlayers.org/library/feature_styling.html#style-properties
		 * @see http://workshops.opengeo.org/openlayers-intro/vector/style-intro.html
		 */
		var symbolizerDefault = OpenLayers.Util.applyDefaults({
			fillColor : "green",
			fillOpacity : 0.4
		}, OpenLayers.Feature.Vector.style['default']);

		var symbolizerSegmentoLogradouro = OpenLayers.Util.applyDefaults({
			strokeColor : "red",
			strokeOpacity : 0.4,
			strokeWidth : 10
		}, OpenLayers.Feature.Vector.style['default']);

		console.log(symbolizerSegmentoLogradouro);

		var symbolizerGuide = OpenLayers.Util.applyDefaults({
			strokeColor : "white",
			strokeOpacity : 1.0,
			strokeWidth : 2,
			strokeDashstyle : 'dash'
		}, OpenLayers.Feature.Vector.style['default']);

		/*
		 * styles
		 */
		var editStyle = new OpenLayers.Style(symbolizerDefault, {
			rules : [ new OpenLayers.Rule({
				filter : new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.EQUAL_TO,
					property : "state",
					value : "segmento_logradouro"
				}),
				symbolizer : symbolizerSegmentoLogradouro
			}), new OpenLayers.Rule({
				elseFilter : true
			}) ]
		});

		var guideStyle = new OpenLayers.Style(symbolizerGuide);

		/*
		 * add styles to the layers
		 */
		MapControl.editLayer.styleMap = new OpenLayers.StyleMap(editStyle);
		MapControl.guideLayer.styleMap = new OpenLayers.StyleMap(guideStyle);
	}
});
