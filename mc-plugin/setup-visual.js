MapControl.register({
	name : "visual-setup",
	init : function(options) {

		var stroke = MapControl.setup('visual-strokeWidth', '2');

		OpenLayers.Feature.Vector.style['default']['strokeWidth'] = stroke;
		
	}
});