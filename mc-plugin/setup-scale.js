MapControl.register({
	name : "scale",
	init : function(options) {
		
		// class for the scale text = olControlScaleLineTop
		
		var divScale = document.createElement('div');
		divScale.setAttribute('id', 'scaleline-id' );
		$('#'+ MapControl.divFooter ).append( divScale );
		
		var scaleline = new OpenLayers.Control.ScaleLine({
			div : divScale,
			bottomOutUnits : ''
		});
		
		MapControl.map.addControl(scaleline);

	}
});