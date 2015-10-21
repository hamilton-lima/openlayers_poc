MapControl.register({
	name : "edit-select",
	icon : 'icon-ok',
	description : 'Seleciona geometrias',
	init : function(options) {
		
		this.control = new OpenLayers.Control.SelectFeature(MapControl.editLayer, {
			clickout : true,
			toggle : true,
			multiple : true,
			hover : false,
			toggleKey : "ctrlKey", // ctrl key removes from selection
			multipleKey : "shiftKey", // shift key adds to selection
			box : true
		});

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