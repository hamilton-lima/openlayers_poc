MapControl.register({
	name : "empty",
	icon: false,
	description: false,
	
	init : function(options) {
		MapControl.log('hello im a empty plugin');
	},
	start : function(event, options) {
		MapControl.log('hello im THE empty plugin');
	},
	end : function(event, options) {
		MapControl.log('bye I was the empty plugin');
	}
});