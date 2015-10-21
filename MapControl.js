var MapControl = new function() {

	// default div names
	this.divMap = "_map";
	this.divToolbar = "_toolbar";
	this.divFooter = "_footer";
	this.defaultPlugin = 'empty';

	this.eventHandlers = {
		onChangeActive : [],
		afterAdd : [],
		afterEdit : [],
		onSelect : []
	};

	this.addEventHandler = function(event, callback) {
		MapControl.log('register: ' + event);

		if ($.isArray(this.eventHandlers[event])) {
			MapControl.eventHandlers[event].push(callback);
			MapControl.log('register: event handler add to [' + event + ']');
		} else {
			MapControl.log('register: INVALID event name=' + event);
		}
	};

	this.handleEvent = function(event, data) {
		this.log('handle event : ' + event + ' data=' + data);
		handlers = this.eventHandlers[event];
		for ( var n in handlers) {
			handlers[n](data);
		}
	};

	// default plugins to be loaded in sequence
	this.scripts = [ 'open-layers.js', 'empty.js' ];
	this.scriptsFolder = 'mc-plugin';
	this.setupUrl = 'MapControl-setup.json';

	this.plugins = new Array();
	this.attrs = {};
	this.attrsadd = {};

	this.currentPlugin = false;

	// alias to add plugin to the list of scripts
	this.addPLugin = function(name) {
		this.scripts.push(name + '.js');
	};

	// alias to add plugin to the list of scripts from JSON url
	this.addPLuginFromJSON = function(url) {

		// read synchronusly the setup information
		$.ajax({
			dataType : "json",
			url : url,
			async : false,
			success : function(data) {
				MapControl.log('addPLuginFromJSON, data : ' + JSON.stringify(data));

				$.each(data, function(key, name) {
					MapControl.scripts.push(name + '.js');
				});
			}
		});
	};

	// store the requested default values
	this.setup = function(key, defaultValue) {

		if (!this.attrs[key]) {
			this.attrs[key] = defaultValue;
			this.attrsadd[key] = defaultValue;
		}

		return this.attrs[key];
	};

	this.addbutton = function(toolbar, id, icon, help) {

		var newlink = document.createElement('a');
		newlink.setAttribute('class', 'btn');
		newlink.setAttribute('name', 'btn_toolbar');
		newlink.setAttribute('rel', 'tooltip');
		newlink.setAttribute('placement', 'top');

		newlink.setAttribute('id', 'btn_' + id);
		newlink.setAttribute('data-original-title', help);
		toolbar.append(newlink);

		var i = document.createElement('i');
		i.setAttribute('class', icon);
		$('#btn_' + id).append(i);

		$('#btn_' + id).on('click', function(e) {
			MapControl.activate(id);
		});

	};

	// add plugins to the toolbar if the plugin has icon
	this.setupToolbar = function() {
		this.log('toolbar');

		var toolbar = $('#' + this.divToolbar);

		toolbar.addClass('btn-group');
		toolbar.attr('data-toggle', 'buttons-radio');

		for (n in this.plugins) {
			plugin = this.plugins[n];

			if (plugin.icon) {
				this.log('toolbar add plugin : ' + plugin.name);
				this.addbutton(toolbar, plugin.name, plugin.icon, plugin.description);
			}
		}

		// activate buttons tooltips
		$('body').tooltip({
			selector : '[rel="tooltip"]'
		});

	};

	// internal objects creation that needs to be ready
	// before any scripts
	this.internalSetup = function() {

		MapControl.log('setup read from : ' + this.setupUrl);

		// read synchronusly the setup information
		$.ajax({
			dataType : "json",
			url : this.setupUrl,
			async : false,
			success : function(data) {
				MapControl.log('setup data : ' + JSON.stringify(data));
				MapControl.attrs = data;
			}
		});

		MapControl.projection = this.setup('projection', 'EPSG:29193');
		MapControl.distanceUnit = this.setup('distanceUnit', 'm');
		MapControl.maxResolution = this.setup('maxResolution', 38.376953125);

		var options = {
			controls : [ new OpenLayers.Control.Navigation({
				documentDrag : true
			}) ],
			maxResolution : MapControl.maxResolution,
			projection : MapControl.projection,
			units : MapControl.distanceUnit
		};

		this.map = new OpenLayers.Map(this.divMap, options);
		// this.map = new OpenLayers.Map(this.divMap);
		this.GeoJSON = new OpenLayers.Format.GeoJSON();
		this.WKT = new OpenLayers.Format.WKT();
	};

	// call for init() if not informed.
	this.initCallback = function() {
		MapControl.log('init end()');
	};

	// callback to call init() for each loaded plugin
	this.defaultCallback = function() {
		MapControl.log('init() for each loaded plugin');

		this.internalSetup();

		// call the init for each plugin
		for (n in this.plugins) {
			this.log('plugin init: ' + this.plugins[n].name);
			this.plugins[n].init();
		}

		this.setupToolbar();

		// show the current setup after the init of each plugin
		MapControl.log('setup data : ' + JSON.stringify(this.attrs));
		MapControl.log('setup NEW itens : ' + JSON.stringify(this.attrsadd));
		MapControl.log('scripts loaded : ' + JSON.stringify(MapControl.scripts));

	};

	// we are ready to rock and roll !!
	// run run run
	this.init = function(callback) {
		this.log('init()');

		if (callback) {
			this.initCallback = callback;
		}

		this.position = 0;
		this.loading();

		var script = MapControl.scriptsFolder + '/' + MapControl.scripts[MapControl.position];
		this.log('script loading : ' + script);
		MapControl.loadScript(script);

	};

	this.loadScript = function(script) {

		$.getScript(script).done(
				function(script, textStatus) {
					MapControl.log('script loaded : ' + MapControl.scripts[MapControl.position]);
					MapControl.position++;

					// ok we are ready
					// all the scripts are loaded
					if (MapControl.position >= MapControl.scripts.length) {
						MapControl.log('finished script loading, run callback');

						MapControl.defaultCallback();
						MapControl.initCallback();
						MapControl.ready();
					} else {
						var script = MapControl.scriptsFolder + '/'
								+ MapControl.scripts[MapControl.position];
						MapControl.log('script loading : ' + script);
						MapControl.loadScript(script);
					}
				}).fail(function(jqxhr, settings, exception) {
			MapControl.log('ERROR loading : ' + exception);
			MapControl.error();
		});
	};

	// register a plugin
	this.register = function(plugin) {
		this.log('plugin register : ' + plugin.name);
		this.plugins.push(plugin);
	};

	this.activateDefault = function() {
		this.activate(this.defaultPlugin);
	};

	this.activate = function(pluginName) {
		this.log('activate : ' + pluginName);
		var current = false;

		// search for the plugin to activate
		for (n in this.plugins) {
			if (this.plugins[n].name == pluginName) {
				current = n;
				break;
			}
		}

		// if current is found activate it
		if (current) {

			this.log('current plugin : ' + this.currentPlugin.name);

			// deactivate current plugin
			if (this.currentPlugin) {
				$('#btn_' + this.currentPlugin.name).removeClass('active');
				this.log('end current plugin : ' + this.currentPlugin.name);
				this.currentPlugin.end();
			}

			// notify the event handlers
			this.handleEvent('onChangeActive', pluginName);

			this.log('call plugin start : ' + this.plugins[current].name);
			this.currentPlugin = this.plugins[current];
			this.plugins[current].start();

			// runOnce
			if (this.plugins[current].runOnce) {
				setTimeout(function() {
					MapControl.activateDefault();
				}, 100);
			}

		} else {
			this.log('not found : ' + pluginName);
		}
	};

	this.formatFeature = function(feature) {
		return this.asJSON(feature);
	};

	this.asJSON = function(feature) {
		return this.GeoJSON.write(feature, true);
	};

	this.asWKT = function(feature) {
		return this.WKT.write(feature, true);
	};

	// default logging
	this.log = function(msg) {
		console.debug('[mc]' + msg);
	};

	this.loading = function(msg) {
		$('#' + this.divMap).html('loading');
	};

	this.error = function(msg) {
		$('#' + this.divMap).html('error');
	};

	this.ready = function(msg) {
		$('#' + this.divMap).html('ready');
	};

	this.add = function(event) {
		MapControl.dump(event);
		MapControl.log('ADD : ' + MapControl.formatFeature(event.feature));
		MapControl.handleEvent('afterAdd', event.feature);
	};

	this.editFeature = function(feature) {
		MapControl.log('EDIT FEATURE: ' + MapControl.formatFeature(feature));
		MapControl.handleEvent('afterEdit', feature);
	};

	this.edit = function(event) {
		MapControl.log('EDIT : ' + MapControl.formatFeature(event.feature));
		MapControl.handleEvent('afterEdit', event.feature);
	};

	this.select = function(data) {
		MapControl.log('SELECT : ' + MapControl.formatFeature(data.feature));
		MapControl.handleEvent('onSelect', data);
	};

	this.dump = function(object) {
		MapControl.log('----- START dump:' + object);

		for ( var key in object) {
			var line = object[key];
			MapControl.log('> ' + key + "=" + line);
		}

		MapControl.log('----- END dump:' + object);
	};

	this.remove = function(id) {
		MapControl.editLayer.removeFeatures(MapControl.editLayer.getFeatureById(id));
	}

};
