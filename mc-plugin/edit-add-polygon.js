MapControl.register({
	name : "edit-add-polygon",
	icon : 'icon-stop',
	description : 'Adiciona polígono ao mapa',
	init : function(options) {

		this.control = new OpenLayers.Control.DrawFeature(MapControl.editLayer,
				OpenLayers.Handler.Polygon);

	},
	start : function(event, options) {
		MapControl.log('start ' + name);
		MapControl.map.addControl(this.control);
		this.control.activate();

	},
	end : function(event, options) {
		MapControl.log('end ' + name);
		MapControl.map.removeControl(this.control);
		this.control.deactivate();
	}

});