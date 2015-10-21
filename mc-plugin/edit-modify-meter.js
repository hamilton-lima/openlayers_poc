/*
 * 1. select from the editLayer the geometry to change the meters
 * 2. add line markers to the modifyLayer, to choose wich line to modify
 */
MapControl.register({
	name : "edit-modify-meter",
	icon : 'icon-resize-full',
	description : 'Modifica metragem de geometrias',
	init : function(options) {
		
		MapControl.distanceDecimalChars = MapControl.setup('distanceDecimalChars', '2');

		// layer to add line selectors
		MapControl.modifyLayer = new OpenLayers.Layer.Vector("Modify Layer", {});

		this.control = new OpenLayers.Control.SelectFeature(MapControl.editLayer, {
			toggle : true,
			multiple : false,
			hover : false,
			box : false,
			select : modifyMeters
		});
		
		MapControl.modifyMeterSelectControl = new OpenLayers.Control.SelectFeature( MapControl.modifyLayer, {
	   	    onSelect: onSelectModifyMeterSelectControl,
	   	    clickout : true,
			toggle : true,
			multiple : false,
			hover : false,
			toggleKey : "ctrlKey", // ctrl key removes from selection
			multipleKey : "shiftKey", // shift key adds to selection
			box : true	    
	    });

	},
	start : function(event, options) {
		MapControl.log('start ' + name);
		MapControl.map.addControl(MapControl.modifyMeterSelectControl);
		MapControl.map.addControl(this.control);
		this.control.activate();
		MapControl.map.addLayer(MapControl.modifyLayer);
	},
	end : function(event, options) {
		MapControl.log('end ' + name);

		this.control.deactivate();
		MapControl.modifyMeterSelectControl.deactivate();
		MapControl.modifyLayer.removeAllFeatures();
		
		MapControl.map.removeControl(MapControl.modifyMeterSelectControl);
		MapControl.map.removeControl(this.control);
		
		MapControl.map.removeLayer(MapControl.modifyLayer);
	}

});

function addLabelModify(point, text, color) {

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

// ask the user to select the line
// 
function modifyMeters(feature){
	MapControl.log('modify-meter feature selected : ' + MapControl.formatFeature(feature) );
	
	// remove previous markers and labels
	MapControl.modifyLayer.removeAllFeatures();
	MapControl.labelLayer.removeAllFeatures();

	// reset the control to choose the line ??
	MapControl.modifyMeterSelectControl.deactivate();
	MapControl.modifyMeterSelectControl.activate();

	var points = feature.geometry.getVertices();
	counter = 1;
	
	for (var i=0;i<points.length-1;i++){
		addMarkerModifyMarker( points[i], points[i+1], feature.id);
	}

	for (var i=0;i<points.length;i++){
		addLabel( points[i], (i+1).toString(), MapControl.distanceLabelColor);
	}
	
	// only allow selection from the last to the first point
	// if its a polygon
	var localWkt = feature.geometry.toString();

	if( localWkt.indexOf('POLYGON') == 0 ){
		addMarkerModifyMarker( points[points.length-1], points[0], feature.id);
	}
	
}

//add a point to the user select the line to change the meters
//
function addMarkerModifyMarker( a, b, owner ){

	MapControl.log('modify-meter, addmarker to choose line : a=' + a + ' b=' + b );
	
	// var ls = new OpenLayers.Geometry.LineString([a, b]);
	var c = calculateCentroid(a,b);
    
	var point = new OpenLayers.Geometry.Point(c.x, c.y);
	var vertice = new OpenLayers.Feature.Vector(point);
	vertice.attributes['a'] = a;	
	vertice.attributes['b'] = b;	
	vertice.attributes['owner'] = owner;
	
	MapControl.modifyLayer.addFeatures([vertice]);
}

// after the user selected the line
function onSelectModifyMeterSelectControl(feature){

	MapControl.log('modify-meter line selected : ' + feature.id );
	
	var a = feature.attributes['a'];	
	var b = feature.attributes['b'];	
	var distance = a.distanceTo(b).toFixed(MapControl.distanceDecimalChars);

	MapControl.log('modify-meter line selected : a=' + a + ' b=' + b + ' distance=' + distance );

	promptModal("Editar Metragem", "Qual a nova metragem da linha ? ",
		feature, distance, applyModifyLayer );

}

// change the line distance
function applyModifyLayer(feature, newSize){

	var a = feature.attributes['a'];	
	var b = feature.attributes['b'];	
	var owner = feature.attributes['owner'];

	MapControl.log('modify-meter apply change : a=' + a + ' b=' + b + ' owner=' + owner );
	
	var ls = new OpenLayers.Geometry.LineString([a, b]);
	
	// calculate scale
	var distance = a.distanceTo(b);
	MapControl.dump(distance);
	var scale = Number(newSize) / Number(distance);
	MapControl.log('modify-meter apply change : ' + 'scale=' + scale + ' newSize=' + newSize );
	
	ls.resize(scale, a);
	var newB = ls.getVertices()[1];
	MapControl.log('modify-meter apply change : ' + 'new B point=' + newB );
	
	var ownerFeature = MapControl.editLayer.getFeatureById(owner);
	var points = ownerFeature.geometry.getVertices();
	
	for (var i=0;i<points.length-1;i++){
		if( points[i].x == b.x && points[i].y == b.y ){
			MapControl.log('modify-meter apply change : FOUND B point');
			
			var dx = points[i].x - b.x;
			var dy = points[i].y - b.y;
			points[i].move( dx, dy );
			break;		
		}
	}
	
	MapControl.editLayer.redraw();
	MapControl.editFeature(ownerFeature);
	MapControl.activateDefault();
}


