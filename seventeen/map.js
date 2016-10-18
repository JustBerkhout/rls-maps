//get source data, using jsonp and callback
var serviceURL = 'http://geoserver-rls.imas.utas.edu.au/geoserver/RLS/ows' + 
			 '?service=WFS' + 
			 '&version=1.1.0' + 
			 '&request=GetFeature' + 
			 '&typeName=RLS:SurveyList' + 
			 '&outputFormat=text%2Fjavascript' + 
			 '&format_options=callback:loadFeatures' + 
			 '&srsname=EPSG:3857'

var myFormat = new ol.format.GeoJSON()

var years = {
	2014: '0,253,255',
	2013: '88,108,167'
}

console.log(_.size(years))

for (yr in years) {
	console.log(yr + ': ' + years[yr])
}

var mySources = {};
var myCSources = {};
var myStyleCaches = {};

var myLayers = [];

//create base layer
//nice black base map, but licensed, mapbox
var base = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.world-black.jsonp',
    crossOrigin: 'anonymous',
	wrapDateLine: true,
	wrapX: true,
	noWrap: false
  })
});

myLayers.push(base)


for (yr in years) {
	
	mySources[yr] = new ol.source.Vector({
	  loader: function(extent, resolution, projection) {
		var url =  serviceURL +
			 '&CQL_FILTER=SurveyDate between ' + yr + '-01-01 and ' + yr + '-12-31'
		$.ajax({
		  url: url
		  ,dataType: 'jsonp'
		  ,jsonp: false
		});
	  }
	});	

	var loadFeatures = function(response) {
	  mySources[yr].addFeatures(myFormat.readFeatures(response));
	};
	
	//convert source data into clusters
	myCSources[yr] = new ol.source.Cluster({
	  distance: 20,
	  source: mySources[yr]  
	});	

		
	myStyleCaches[yr] = {};
	//var styleCache = {};
	myLayers.push( new ol.layer.Vector({
	  source: myCSources[yr],
	  style: function(feature, resolution) {
		var size = feature.get('features').length;
		var style = myStyleCaches[yr][size];
		if (!style) {
		  style = [new ol.style.Style({
			image: new ol.style.Circle({
			  radius: (size==1) ? 7 : 10 + (0.08 * size), //1 survey:7, multiples scaling
			  stroke: new ol.style.Stroke({
				color: (size==1) ? '#000' : '#fff' // one survey black, multiples white stroke
			  }),
			  fill: new ol.style.Fill({
				color: 'rgba(' + years[yr] + ', 0.8)' 
			  })
			}),
			text: new ol.style.Text({
			  text: (size==1) ? '' : size.toString(), //one survey empty, multiples annotate with number
			  fill: new ol.style.Fill({
				color: '#fff'
			  })
			})
		  })];
		  myStyleCaches[yr][size] = style;
		}
		return style;
	  }
	})
	);	
	
};

console.log(myLayers)




//create map
var map = new ol.Map({
  target: 'map', 
  layers: myLayers,
  controls: [],
  view: new ol.View({
    center: [-26.851989, 137.185032],
    zoom: 2,
	minZoom: 2,
	maxZoom: 11
  })
});