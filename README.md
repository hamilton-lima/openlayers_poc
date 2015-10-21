# Openlayers POC

See live demo here http://hamilton-lima.github.io/openlayers_poc/

Some highlights of this demo : 

## Plugin structure
Each page loads a different set of plugins defined in a json file.
The json to be loaded is defined here :

``` 
MapControl.addPLuginFromJSON('MapControl-plugins-OSM.json');
```

This is one example of the plugins loaded

```
[
    "open-layers",
    "empty",
    "map-wms",
    "setup-center-wms",
    "setup-visual",
    "setup-scale",
    "setup-mouse",
    "setup-gui",
    "setup-zoom",
    "edit-setup",    
    "edit-setup-style",
    "edit-show-area-distance",
    "edit-navigate",
    "edit-select",
    "edit-add-polygon",
    "edit-add-line",
    "edit-add-point",
    "edit-modify",
    "edit-modify-meter",
    "edit-add-guidelines",
    "edit-remove-guidelines",
    "edit-convert2curve",
    "view-fullscreen"
]
```

:tangerine: All the plugins are in the folder [mc-plugin](https://github.com/hamilton-lima/openlayers_poc/tree/master/mc-plugin)

!Some plugins details 

| plugin name | description | 
| ----------- | ----------- | 
| [edit-modify-meter](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-modify-meter.js) | change the distance of a selected line |
| [edit-add-guidelines](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-add-guidelines.js) | add parallel guide lines around the selected geometry | 
| [edit-convert2curve](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-convert2curve.js) | convert one line to a curve |
| [view-fullscreen](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/view-fullscreen.js) | change the view to full screen mode | 

