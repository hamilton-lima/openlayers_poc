MapControl.register({
	name : "edit-remove-guidelines",
	icon : 'icon-remove',
	description : 'Remove todas as linhas guia',

	init : function(options) {
		MapControl.log('init ' + this.name);
	},
	
	start : function(event, options) {
		MapControl.log('start ' + this.name);
		MapControl.guideLayer.removeAllFeatures();
	},	
	
	runOnce : true,

	end : function(event, options) {
		MapControl.log('end ' + this.name);
	}
});

