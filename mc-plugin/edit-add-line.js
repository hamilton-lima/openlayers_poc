MapControl.register({
	name : "open-layers-add-line",
	icon : 'icon-pencil',
	description : 'Adiciona linha ao mapa',
	init : function(options) {

		this.control = new OpenLayers.Control.DrawFeature(MapControl.editLayer,
				OpenLayers.Handler.Path);

	},
	start : function(event, options) {
		MapControl.log('start ' + this.name);
		MapControl.map.addControl(this.control);
		this.control.activate();

	},
	end : function(event, options) {
		MapControl.log('end ' + this.name);
		MapControl.map.removeControl(this.control);
		this.control.deactivate();
	}

});