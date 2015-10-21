MapControl.register({
	name : "view-fulscreen",
	icon : 'icon-fullscreen',
	description : 'Coloca mapa em modo full screen',
	layer : null,
	init : function(options) {
		MapControl.log('init ' + this.name);
		
		MapControl.fullScreen = false;
		
		var style = $('<style>' 
				+ '.full-screen-map { '
				+ 'position: absolute; top: 0px; left: 0px; margin: 0; '
				+ 'width: 100%; height: 100%; }'
				+ '.float-toolbar { z-index: 20000; position: absolute; top: 40px; left: 50px;}'
				+ '</style>');
		$('html > head').append(style);
		
	},
	start : function(event, options) {
		MapControl.log('start ' + this.name);
		
		if( MapControl.fullScreen ){
			$('#' + MapControl.divMap).removeClass('full-screen-map');			
			$('#' + MapControl.divToolbar).removeClass('float-toolbar');
			MapControl.fullScreen = false;
			
		} else {
			$('#' + MapControl.divMap).addClass('full-screen-map');
			$('#' + MapControl.divToolbar).addClass('float-toolbar');
			MapControl.fullScreen = true;
		}
		
		MapControl.map.updateSize();
		
		// this.divToolbar
		// this.divFooter 
		
		
	},
	runOnce : true,
	end : function(event, options) {
		MapControl.log('end ' + this.name);
	}

});