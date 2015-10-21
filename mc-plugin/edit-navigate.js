MapControl.register({
	name : "navigate",
	icon : 'icon-th',
	description : 'Navega no mapa sem editar',
	layer : null,
	init : function(options) {
		MapControl.log('init ' + this.name);
	},
	start : function(event, options) {
		MapControl.log('start ' + this.name);
	},
	end : function(event, options) {
		MapControl.log('end ' + this.name);
	}

});