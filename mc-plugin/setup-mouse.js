MapControl.register({
	name : "mouse",
	init : function(options) {
		
		// class for the scale text = olControlScaleLineTop
		
		var divMouse = document.createElement('div');
		divMouse.setAttribute('id', 'mouseposition-id' );
		$('#'+ MapControl.divFooter ).append( divMouse );
		
		
		var mousepos = new OpenLayers.Control.MousePosition({
			div : divMouse,
			prefix : 'Posição do mouse: '
		});
		
		MapControl.map.addControl(mousepos);

	}
});