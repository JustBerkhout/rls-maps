//get source data, using jsonp and callback
var rlsSource = new ol.source.ServerVector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection) {
	var url = 'http://geoserver-rls.imas.utas.edu.au/geoserver/RLS/ows?' + 
		 'service=WFS&' + 
		 'version=1.0.0&' + 
		 'request=GetFeature&' + 
		 'typeName=RLS:SiteList&' + 
		 'outputFormat=text%2Fjavascript&' + 
		 'format_options=callback:loadFeatures' + 
		 '&srsname=EPSG:3857'; 
	$.ajax({
	  url: url,
	  dataType: 'jsonp'
	});
  },
  projection: 'EPSG:3857'
});

var loadFeatures = function(response) {
  rlsSource.addFeatures(rlsSource.readFeatures(response));
};

//convert sourcedata into clusters
var clusterSource = new ol.source.Cluster({
  distance: 20,
  source: rlsSource,
  attributions: [new ol.Attribution({
      html: '<a target="_new" href="http://www.reeflifesurvey.com/"><img src="RLS.png" /> Reef Life Survey</a>'
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
            color: 'rgba(51,153,204, 0.8)' //'#3399CC' 
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
var base = new ol.layer.Tile({
  source: new ol.source.MapQuest({
		layer: 'sat'
	})
});

//create map
var map = new ol.Map({
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ]),	
  layers: [base, clusters],
  target: 'map', 
  view: new ol.View({
    //center: [-26.851989, 137.185032],
	center: [0,0],
    zoom: 3,
	minZoom: 2,
	maxZoom: 11
  })
});