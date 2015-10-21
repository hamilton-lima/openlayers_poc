MapControl.register({
	name : "edit-show-area-distance",
	init : function(options) {

		MapControl.distanceDecimalChars = MapControl.setup('distanceDecimalChars', '2');

		MapControl.areaDecimalChars = MapControl.setup('areaDecimalChars', '2');
		MapControl.distanceLabelColor = MapControl.setup('distanceLabelColor', 'black');

		MapControl.labelFontSize = MapControl.setup('labelFontSize', '14px');
		MapControl.labelFontFamily = MapControl.setup('labelFontFamily', 'Arial');
		MapControl.labelFontWeight = MapControl.setup('labelFontWeight', 'bold');
		MapControl.labelLabelAlign = MapControl.setup('labelLabelAlign', '2');

		MapControl.defaultAreaUnit = MapControl.setup('defaultAreaUnit', ' m2');
		MapControl.areaLabelColor = MapControl.setup('areaLabelColor', 'black');

		MapControl.labelLayer = new OpenLayers.Layer.Vector("Label Layer", {});
		MapControl.map.addLayer(MapControl.labelLayer);

		MapControl.showGeometryInfo = function(event) {
			showGeometryInfo(event);
		};

		MapControl.editLayer.events.on({
			'vertexmodified' : MapControl.showGeometryInfo,
			'sketchmodified' : MapControl.showGeometryInfo,
		});
		
		// when change the active plugin remove all the labels
		MapControl.addEventHandler('onChangeActive', function(data) {
			MapControl.labelLayer.removeAllFeatures();
			MapControl.labelLayer.redraw();
		});

		MapControl.addEventHandler('onSelect', function(event) {
			showGeometryInfo(event);
		});


	}
});

function showGeometryInfo(event) {

	MapControl.log('showGeometryInfo :' + event);

	if (event.feature) {
		feature = event.feature;
		
		var vertices = feature.geometry.getVertices();

		if (vertices.length > 1) {

			// only remove if there are new vertices !!
			MapControl.labelLayer.removeAllFeatures();

			for ( var i = 0; i < vertices.length - 1; i++) {
				addMeterDistance(vertices[i], vertices[i + 1]);
			}

			if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Polygon') {
				addMeterDistance(vertices[vertices.length - 1], vertices[0]);
			}
		}

		if (vertices.length > 3) {

			if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Polygon') {
				bounds = feature.geometry.getBounds();

				var center = bounds.getCenterLonLat();
				var point = new OpenLayers.Geometry.Point(center.lon, center.lat);

				var area = calculateArea(event.feature).toFixed(MapControl.areaDecimalChars);

				addLabelGeometry(point, area.toString() + MapControl.defaultAreaUnit, MapControl.areaLabelColor);
			}
		}
	}

}

function addMeterDistance(a, b) {
	var point = calculateCentroid(a, b);
	var distance = Number(a.distanceTo(b)).toFixed(MapControl.distanceDecimalChars);

	MapControl.log('addMeterDistance : ' + distance);
	addLabel(point, distance.toString(), MapControl.distanceLabelColor);
}

function addLabelGeometry(geometry, text, color) {

	textNode = new OpenLayers.Feature.Vector(geometry, {}, {
		label : text,
		fontColor : color,
		fontSize : MapControl.labelFontSize,
		fontFamily : MapControl.labelFontFamily,
		fontWeight : MapControl.labelFontWeight,
		labelAlign : MapControl.labelLabelAlign
	});

	MapControl.labelLayer.addFeatures([ textNode ]);
}

function addLabel(point, text, color) {

	textNode = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.x, point.y), {}, {
		label : text,
		fontColor : color,
		fontSize : MapControl.labelFontSize,
		fontFamily : MapControl.labelFontFamily,
		fontWeight : MapControl.labelFontWeight,
		labelAlign : MapControl.labelLabelAlign
	});

	MapControl.labelLayer.addFeatures([ textNode ]);
}
