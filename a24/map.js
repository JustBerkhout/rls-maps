//get source data, from the SiteList.php 
var rlsSource = new ol.source.Vector({
    url: 'SiteList.php'
    , format: new ol.format.GeoJSON() 
});

//convert source data into clusters
var clusterSource = new ol.source.Cluster({
  distance: 10,
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
          radius: (size==1) ? 5 : 10 + (0.08 * size), //1 survey:7, multiples scaling
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
//nice black base map, but licensed, mapbox https://www.mapbox.com/pricing/
var base = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.world-black.jsonp',
    crossOrigin: 'anonymous',
	wrapDateLine: true,
	wrapX: true,
	noWrap: true
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
	center: [0,0]
    ,zoom: 3
	,minZoom: 2
//	,maxZoom: 11
  })
});
