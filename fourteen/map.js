//get source data, using jsonp and callback

var myFormat = new ol.format.GeoJSON()

var rlsSource = new ol.source.Vector({
  loader: function(extent, resolution, projection) {
	var url = 'http://geoserver-rls.imas.utas.edu.au/geoserver/RLS/ows' + 
		 '?service=WFS' + 
		 '&version=1.1.0' + 
		 '&request=GetFeature' + 
		 '&typeName=RLS:SurveyList' + 
		 '&outputFormat=text%2Fjavascript' + 
		 '&format_options=callback:loadFeatures' + 
		 '&CQL_FILTER=SurveyDate between 2014-07-01 and 2015-07-01' + 
		 '&srsname=EPSG:3857'; 
	$.ajax({
	  url: url
	  ,dataType: 'jsonp'
	  ,jsonp: false
	});
  }
});

var loadFeatures = function(response) {
  rlsSource.addFeatures(myFormat.readFeatures(response));
};

//convert source data into clusters
var clusterSource = new ol.source.Cluster({
  distance: 20,
  source: rlsSource,
  attributions: [new ol.Attribution({
      html: '<a target="_new" href="http://www.reeflifesurvey.com/">Reef Life Survey</a>'
    })]  
});

//create visualisation of clusters in vector layer
var styleCache = {};
var clusters = new ol.layer.Vector({
  source: clusterSource,
  style: function(feature, resolution) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      style = [new ol.style.Style({
        image: new ol.style.Circle({
          radius: (size==1) ? 7 : 10 + (0.08 * size), //1 survey:7, multiples scaling
          stroke: new ol.style.Stroke({
            color: (size==1) ? '#000' : '#fff' // one survey black, multiples white stroke
          }),
          fill: new ol.style.Fill({
            color: 'rgba(209,60,55, 0.8)' 
          })
        }),
        text: new ol.style.Text({
          text: (size==1) ? '' : size.toString(), //one survey empty, multiples annotate with number
          fill: new ol.style.Fill({
            color: '#fff'
          })
        })
      })];
      styleCache[size] = style;
    }
    return style;
  }
});

//create base layer
//nice black base map, but licensed, mapbox
var base = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.world-black.jsonp',
    crossOrigin: 'anonymous'
  })
});

//create map
var map = new ol.Map({
  target: 'map', 
  layers: [base, clusters],
  controls: [],
  view: new ol.View({
    center: [-26.851989, 137.185032],
    zoom: 2,
	minZoom: 2,
	maxZoom: 11
  })
});