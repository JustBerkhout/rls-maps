//get source data, using jsonp and callback


var WMSLayer =   new ol.layer.Image({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.ImageWMS({
      url: 'http://geoserver-rls.imas.utas.edu.au/geoserver/wms',
      params: {
		'LAYERS': 'RLS:SpeciesObservation_temp'
		, 'CQL_FILTER': "Species_name='Heterodontus portusjacksoni'"},
      serverType: 'geoserver'
    })
  })

//create base layer
var base = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer:'sat'})
});



//create map
var map = new ol.Map({
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ]),
  layers: [base, WMSLayer],
  target: 'map', 
  view: new ol.View({
	center: [0,0]
    ,zoom: 3
	,minZoom: 2
	,maxZoom: 11
  })
});

function myButtonClick() {
	console.log(WMSLayer.getExtent())
}