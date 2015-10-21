MapControl.register({
	name : "zoom",
	init : function(options) {
		
		var zoom = new OpenLayers.Control.Zoom();
		MapControl.map.addControl(zoom);

	}
});