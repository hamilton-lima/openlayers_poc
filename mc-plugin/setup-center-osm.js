MapControl.register({
	name : "location",
	init : function(options) {

		var lon = MapControl.setup('center-lon', -43.179402);
		var lat = MapControl.setup('center-lat', -22.910096);
		var zoom = MapControl.setup('center-zoom', 15);

		// Transform from WGS 1984 to Spherical Mercator Projection
		var fromProjection = new OpenLayers.Projection("EPSG:4326");
		var toProjection = new OpenLayers.Projection("EPSG:900913");

		var position = new OpenLayers.LonLat(lon, lat).transform(
				fromProjection, toProjection);

		MapControl.map.setCenter(position, zoom);

	}
});