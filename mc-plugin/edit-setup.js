MapControl.register({
	name : "edit-setup",
	init : function(options) {

		MapControl.editLayer = new OpenLayers.Layer.Vector("Edit Layer", {});
		MapControl.map.addLayer(MapControl.editLayer);

		MapControl.guideLayer = new OpenLayers.Layer.Vector("Guide Layer", {});
		MapControl.map.addLayer(MapControl.guideLayer);

		// events
		MapControl.editLayer.events.register("featureadded", ' ', MapControl.add);
		MapControl.editLayer.events.register("featuremodified", ' ', MapControl.edit);

		MapControl.editLayer.events.on({
			'featureselected' : MapControl.select,
			'featureunselected' : MapControl.select,
		});

		// snap
		MapControl.snapping = new OpenLayers.Control.Snapping({
			layer : MapControl.editLayer,
			targets : [ MapControl.editLayer, MapControl.guideLayer ],
			greedy : false
		});

		MapControl.snapping.activate();

	}
});

// calculate center of the line
function calculateCentroid(a, b) {
	var point = new OpenLayers.Geometry.Point((a.x + b.x) / 2, (a.y + b.y) / 2);
	return point;
}

// calculate the area of a geometry
function calculateArea(features) {

	var area = 0;

	if (features) {
		if (features.constructor != Array) {
			features = [ features ];
		}

		for ( var i = 0; i < features.length; ++i) {
			area += features[i].geometry.getArea();
		}

	}

	return area;
}

function removePoint(layer, feature, position){
	
	var points = feature.geometry.getVertices();
	points.splice(position, 1);
	
	var id = feature.id;
	var attributes = feature.attributes;
	
	var polygon = false;
	
	if( feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon"){
	    var ring = new OpenLayers.Geometry.LinearRing(points);
	    polygon = new OpenLayers.Geometry.Polygon([ring]);
	}

	if( feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString"){
	    polygon = new OpenLayers.Geometry.LineString(points);
	}
	
    var result = new OpenLayers.Feature.Vector(polygon, attributes);
    result.id = id;
    
	// apply the changes to the layer
	layer.removeFeatures([feature], {silent: true});
	feature.destroy();
	
	layer.addFeatures([result], {silent: true});
    return result;
	
}


function insertPoints(layer, feature, position, newPoints){
	
	var points = feature.geometry.getVertices();
	
	for (var i=0; i < newPoints.length; i++){
		points.splice(position +i, 0, newPoints[i]);
	}

	var id = feature.id;
	var attributes = feature.attributes;
	
	var polygon = false;
	
	if( feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon"){
	    var ring = new OpenLayers.Geometry.LinearRing(points);
	    polygon = new OpenLayers.Geometry.Polygon([ring]);
	}

	if( feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString"){
	    polygon = new OpenLayers.Geometry.LineString(points);
	}

    var result = new OpenLayers.Feature.Vector(polygon, attributes);
    result.id = id;

	// apply the changes to the layer
	layer.removeFeatures([feature], {silent: true});
	feature.destroy();
	
	layer.addFeatures([result], {silent: true});
    return result;
}

