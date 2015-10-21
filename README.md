# Openlayers POC

See live demo here http://hamilton-lima.github.io/openlayers_poc/

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
    "map-osm",
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

## Plugins details 

| plugin name | description | 
| ----------- | ----------- | 
| open-layers | load the core openlayers framework, load by the plugin control to be able to change versions in the future |
| empty | example of empty plugin |
| map-wms | example of an plugin that loads data from an geoserver in the format wms |
| map-osm | loads openstreet-map map data |
| setup-center-* | center the projection in a specific longitude/latitude |
| edit-show-are-distance | setup to show line distances and area calculation inside polygons | 
| edit-add-* | add polygon, line and point based on openlayers examples | 
| [edit-modify-meter](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-modify-meter.js) | change the distance of a selected line |
| [edit-add-guidelines](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-add-guidelines.js) | add parallel guide lines around the selected geometry, the user can input the distance in meters of the guide lines | 
| [edit-convert2curve](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/edit-convert2curve.js) | convert one line to a curve, the user an input the width of the curve that will be generated |
| [view-fullscreen](https://github.com/hamilton-lima/openlayers_poc/blob/master/mc-plugin/view-fullscreen.js) | change the view to full screen mode | 

## Screenshots

Showing distance on lines and area of the polygon
http://hamilton-lima.github.io/openlayers_poc/screenshots/2015-10-21_0819.png

Parallel guidelines add to help snap of the next polygons
http://hamilton-lima.github.io/openlayers_poc/screenshots/2015-10-21_0820.png

Corner converted to curve 
http://hamilton-lima.github.io/openlayers_poc/screenshots/2015-10-21_0821.png
