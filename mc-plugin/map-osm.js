MapControl.register({
	name : "map-osm",
	init : function(options) {
		var maposm = new OpenLayers.Layer.OSM();
		MapControl.map.addLayer(maposm);
	}
});