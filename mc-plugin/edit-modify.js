MapControl.register({
	name : "edit-modify",
	icon : 'icon-edit',
	description : 'Modifica geometria',
	init : function(options) {
		
		this.control = new OpenLayers.Control.ModifyFeature(MapControl.editLayer);

		this.control.mode = OpenLayers.Control.ModifyFeature.RESHAPE
				| OpenLayers.Control.ModifyFeature.ROTATE;

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