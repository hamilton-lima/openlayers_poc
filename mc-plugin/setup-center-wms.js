MapControl.register({
	name : "location",
	init : function(options) {
		
		var lon = MapControl.setup('wms-center-lon', 575189.53415);
		var lat = MapControl.setup('wms-center-lat', 9673575.66077);
		var zoom = MapControl.setup('wms-center-zoom', 6);


		// Transform from WGS 1984 to Spherical Mercator Projection
		var fromProjection = new OpenLayers.Projection("EPSG:4326");
		var toProjection = new OpenLayers.Projection("EPSG:900913");

		var position = new OpenLayers.LonLat(lon, lat).transform(
				fromProjection, toProjection);

		MapControl.map.setCenter(position, zoom);

	}
});