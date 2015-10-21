MapControl.register({
	name : "edit-add-guidelines",
	icon : 'icon-align-justify',
	description : 'Adiciona linhas guia',
	init : function(options) {

		MapControl.distanceDecimalChars = MapControl.setup('distanceDecimalChars', '2');
		MapControl.guideLineDistance = MapControl.setup('guideLineDistance', '10');

		this.control = new OpenLayers.Control.SelectFeature(MapControl.editLayer, {
			toggle : true,
			multiple : false,
			hover : false,
			box : false,
			select : addGuideLines
		});

	},
	start : function(event, options) {
		MapControl.log('start ' + this.name);
		MapControl.map.addControl(this.control);
		this.control.activate();
	},
	end : function(event, options) {
		MapControl.log('end ' + this.name);
		this.control.deactivate();
		MapControl.map.removeControl(this.control);
	}

});

/*
 * ask the user for the guide line distance
 */
function addGuideLines(feature) {
	MapControl.log('edit-add-guidelines feature selected : ' + MapControl.formatFeature(feature));

	promptModal("Adiciona linhas guia", "Qual a distância para as linhas guia ? ", feature,
			MapControl.guideLineDistance, applyGuideLines);

}

/*
 * create the guide lines
 */
function applyGuideLines(feature, distance) {

	MapControl.log('edit-add-guidelines feature selected : ' + MapControl.formatFeature(feature));
	MapControl.log('edit-add-guidelines distance : ' + distance);

	var points = feature.geometry.getVertices();

	for ( var i = 0; i < points.length - 1; i++) {
		var lines = calculateParallel(points[i], points[i + 1], distance);

		addLine(lines[0].p1, lines[0].p2);
		addLine(lines[1].p1, lines[1].p2);
	}

	// only allow selection from the last to the first point
	// if its a polygon
	var localWkt = feature.geometry.toString();

	if (localWkt.indexOf('POLYGON') == 0) {
		var lines = calculateParallel(points[points.length - 1], points[0], distance);

		addLine(lines[0].p1, lines[0].p2);
		addLine(lines[1].p1, lines[1].p2);
	}

}

function addLine(a, b) {
	var line = new OpenLayers.Geometry.LineString([ a, b ]);
	var vertice = new OpenLayers.Feature.Vector(line);
	MapControl.guideLayer.addFeatures([ vertice ]);
}

/**
 * Calculate the parallel lines around the line segment of a,b
 * 
 * @returns Array of object {p1,p2} with the new lines
 */
function calculateParallel(a, b, n) {

	var x1 = a.x;
	var y1 = a.y;
	var x2 = b.x;
	var y2 = b.y;

	var c1 = y2 - y1;
	var c2 = x2 - x1;
	var h = Math.sqrt((c1 * c1) + (c2 * c2));
	var sin = c2 / h;
	var alfa = Math.asin(sin);
	var teta = Math.PI - Math.PI / 2 - alfa;

	var dx = n * Math.sin(teta);
	var dy = n * Math.cos(teta);

	if (y1 < y2) {
		return [ {
			p1 : new OpenLayers.Geometry.Point(x1 - dx, y1 + dy),
			p2 : new OpenLayers.Geometry.Point(x2 - dx, y2 + dy)
		}, {
			p1 : new OpenLayers.Geometry.Point(x1 + dx, y1 - dy),
			p2 : new OpenLayers.Geometry.Point(x2 + dx, y2 - dy)
		}, ];

	} else {

		return [ {
			p1 : new OpenLayers.Geometry.Point(x1 - dx, y1 - dy),
			p2 : new OpenLayers.Geometry.Point(x2 - dx, y2 - dy)
		}, {
			p1 : new OpenLayers.Geometry.Point(x1 + dx, y1 + dy),
			p2 : new OpenLayers.Geometry.Point(x2 + dx, y2 + dy)
		}, ];
	}

}

