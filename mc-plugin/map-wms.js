MapControl
		.register({
			name : "map-wms",
			init : function(options) {

				MapControl.wmsTileName = MapControl.setup('wmsTileName', 'bacabeira tiled');

				MapControl.wmsServerUrl = MapControl
						.setup('wmsServerUrl',
								'http://ec2-54-232-47-108.sa-east-1.compute.amazonaws.com:8080/geoserver/bacabeira/wms');
				MapControl.wmsWorkspace = MapControl.setup('wmsWorkspace', 'bacabeira');
				MapControl.wmsLayer = MapControl.setup('wmsLayer', 'bacabeira_sad69');
				MapControl.wmsFormat = MapControl.setup('wmsFormat', 'image/png');

				// maps limits
				MapControl.boundsLon1 = MapControl.setup('boundsLon1', 571616.8796677258);
				MapControl.boundsLat1 = MapControl.setup('boundsLat1', 9668685.597442776);
				MapControl.boundsLon2 = MapControl.setup('boundsLon2', 578129.8796677258);
				MapControl.boundsLat2 = MapControl.setup('boundsLat2', 9678510.097442776);

				var bounds = new OpenLayers.Bounds(MapControl.boundsLon1, MapControl.boundsLat1,
						MapControl.boundsLon2, MapControl.boundsLat2);

				// define map limits based on bounds
				MapControl.map.maxExtent = bounds;
				MapControl.map.restrictedExtent = bounds;
				
				MapControl.wms = new OpenLayers.Layer.WMS(MapControl.wmsTileName,
						MapControl.wmsServerUrl, {
							LAYERS : MapControl.wmsWorkspace + ':' + MapControl.wmsLayer,
							STYLES : '',
							format : MapControl.wmsFormat,
							tiled : true,
							tilesOrigin : bounds.left + ',' + bounds.bottom,
							srs : MapControl.projection
						}, {
							buffer : 0,
							displayOutsideMaxExtent : false,
							isBaseLayer : true,
							yx : {
								defaultProjection : false
							}
						});

				MapControl.map.addLayer(MapControl.wms);

			}
		});