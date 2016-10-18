//get source data, using jsonp and callback


var WMSLayer =   new ol.layer.Image({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.ImageWMS({
      url: 'http://geoserver-rls.imas.utas.edu.au/geoserver/wms',
      params: {
		'LAYERS': 'RLS:SpeciesObservation_temp'
		, 'CQL_FILTER': "Species_name='Pomacentrus pavo'"},
      serverType: 'geoserver'
    })
  })

//create base layer
//nice black base map, but licensed, mapbox https://www.mapbox.com/pricing/
var base = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.world-black.json',
    crossOrigin: 'anonymous',
	wrapDateLine: true,
	wrapX: true,
	noWrap: true
  })
});

      var mapView = new ol.View({
	center: ol.proj.transform([135,-25], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      });	

//create map
var map = new ol.Map({
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ]),
  layers: [base, WMSLayer],
  target: 'map', 
  view: mapView,
  projection:"EPSG:4326" 
});

function myButtonClick() {
//map.getView().setCenter(ol.proj.transform([135,-25], 'EPSG:4326', 'EPSG:3857'))
var mySpeciesvar = dojo.byId("speciesSelect");

var CQL = "Species_name='" + mySpeciesvar.value  + "'"
WMSLayer.getSource().updateParams({'CQL_FILTER': CQL});
};
