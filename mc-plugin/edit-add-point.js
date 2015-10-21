MapControl.register({
	name : "edit-add-point",
	icon : 'icon-map-marker',
	description : 'Adiciona ponto ao mapa',
	init : function(options) {

		this.control = new OpenLayers.Control.DrawFeature(MapControl.editLayer,
				OpenLayers.Handler.Point);

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