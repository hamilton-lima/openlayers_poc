/*
 * 1. select from the editLayer the geometry to convert an edge to curve
 * 2. add edge markers to the modifyLayer, to choose wich edge to modify
 * 3. enter the curve distance and convert the lines in a curve (multiple lines representing a bezier curve)
 */
MapControl.register({
	name : "edit-convert2curve",
	icon : 'icon-play-circle',
	description : 'Converte um vertice em curva',
	init : function(options) {

		MapControl.distanceDecimalChars = MapControl.setup('distanceDecimalChars', '2');
		MapControl.curveDistance = MapControl.setup('curveDistance', '20');

		// layer to add line selectors
		MapControl.convert2curveLayer = new OpenLayers.Layer.Vector("convert2curve Layer", {});

		this.control = new OpenLayers.Control.SelectFeature(MapControl.editLayer, {
			toggle : true,
			multiple : false,
			hover : false,
			box : false,
			select : convert2curveMeters
		});

		MapControl.convert2curveMeterSelectControl = new OpenLayers.Control.SelectFeature(
				MapControl.convert2curveLayer, {
					onSelect : onSelectconvert2curveMeterSelectControl,
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
		MapControl.map.addControl(MapControl.convert2curveMeterSelectControl);
		MapControl.map.addControl(this.control);
		this.control.activate();
		MapControl.map.addLayer(MapControl.convert2curveLayer);
	},
	end : function(event, options) {
		MapControl.log('end ' + name);

		this.control.deactivate();
		MapControl.convert2curveMeterSelectControl.deactivate();
		MapControl.convert2curveLayer.removeAllFeatures();

		MapControl.map.removeControl(MapControl.convert2curveMeterSelectControl);
		MapControl.map.removeControl(this.control);

		MapControl.map.removeLayer(MapControl.convert2curveLayer);
	}

});

// ask the user to select the line
// 
function convert2curveMeters(feature) {
	MapControl.log('convert2curve-meter feature selected : ' + MapControl.formatFeature(feature));

	// remove previous markers
	MapControl.convert2curveLayer.removeAllFeatures();

	// reset the control to choose the line
	MapControl.convert2curveMeterSelectControl.deactivate();
	MapControl.convert2curveMeterSelectControl.activate();

	var points = feature.geometry.getVertices();

	// start on the second point
	for ( var i = 1; i < points.length-1; i++) {
		addMarker(points[i - 1], points[i], points[i + 1], feature.id, i);
	}

	// only allow selection from the last to the first point if its a polygon
	var localWkt = feature.geometry.toString();
	if (localWkt.indexOf('POLYGON') == 0) {
		addMarker(points[points.length - 1], points[0], points[1], feature.id, 0);
		addMarker(points[points.length - 2], points[points.length - 1], points[0], feature.id, points.length - 1);
	}

}

// after the user selected the line
function onSelectconvert2curveMeterSelectControl(feature) {

	MapControl.log('convert2curve-meter edge selected selected : ' + feature.id);

	var a = feature.attributes['a'];
	// var distance = MapControl.curveDistance; // a.distanceTo(b).toFixed(MapControl.distanceDecimalChars);

	MapControl.log('convert2curve-meter edge selected selected : a=' + a);

	promptModal("Metragem da Curva", "Qual a distância da curva ? ", feature,
			MapControl.curveDistance, applyconvert2curveLayer);

}


// change the line distance
function applyconvert2curveLayer(feature, newSize) {

	var a = feature.attributes['a'];
	var b = feature.attributes['b'];
	var c = feature.attributes['c'];
	var pos = feature.attributes['pos'];
	
	var owner = feature.attributes['owner'];
	var ownerFeature = MapControl.editLayer.getFeatureById(owner);

	MapControl.log('convert2curve-meter apply change : a=' + a + ' owner=' + owner + ' distance = '
			+ newSize);
	
	var p1 = getNewPoint(b, a, newSize );
	var p2 = getNewPoint(b, c, newSize );

	MapControl.log('convert2curve-meter : p1=' + p1 );	
	MapControl.log('convert2curve-meter : p2=' + p2 );	

	var curvePoints = new Array();
	curvePoints.push(p1);
	
	for(var n=0; n <= 1; n+= 0.1){
    	var p = interpolate(p1,b,p2,n);
    	var point = new OpenLayers.Geometry.Point(p.x, p.y);
    	curvePoints.push(point);
	}
	
	curvePoints.push(p2);
	
	// apply the new points to the feature
	ownerFeature = removePoint(MapControl.editLayer, ownerFeature, pos);	
	ownerFeature = insertPoints(MapControl.editLayer, ownerFeature, pos, curvePoints);	

	MapControl.editLayer.redraw();
	
	// trigger edit event and set the default control as the current
	MapControl.editFeature(ownerFeature);
	MapControl.activateDefault();

}

// add a point to the user select the line to change the meters
//
function addMarker(a, b, c, owner, pos) {

	MapControl.log('convert2curve-meter, addmarker to choose edge : b=' + b);

	var point = new OpenLayers.Geometry.Point(b.x, b.y);
	var vertice = new OpenLayers.Feature.Vector(point);
	vertice.attributes['a'] = a;
	vertice.attributes['b'] = b;
	vertice.attributes['c'] = c;
	vertice.attributes['pos'] = pos;
	
	vertice.attributes['owner'] = owner;

	MapControl.convert2curveLayer.addFeatures([ vertice ]);
}

// @see http://blog.sklambert.com/finding-the-control-points-of-a-bezier-curve
// @see http://www.youtube.com/watch?v=YATikPP2q70
// @see http://jsfiddle.net/hamiltonlima/Vc3aX/
function interpolate(p1,p2,p3,n){
	var p1p2 = { x: ((1-n)*p1.x)+(n*p2.x), y: ((1-n)*p1.y)+(n*p2.y) };
	var p2p3 = { x: ((1-n)*p2.x)+(n*p3.x), y: ((1-n)*p2.y)+(n*p3.y) };
	var p = { x: ((1-n)*p1p2.x)+(n*p2p3.x), y: ((1-n)*p1p2.y)+(n*p2p3.y) };
	return p;
}


// calculate the new point based on the on the proportion distance/currentDistance = n
function getNewPoint( p1, p2, distance ){
	
	var currentDistance = p1.distanceTo(p2);
	var n = Number(distance) / Number(currentDistance);
	
	var point = new OpenLayers.Geometry.Point(
			((1-n)*p1.x)+(n*p2.x), 
			((1-n)*p1.y)+(n*p2.y) );
	
	return point;
}